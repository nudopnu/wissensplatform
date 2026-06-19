-- stolperprotokoll.lua
-- Valides Lua – @-Annotationen werden vom stolpro-Präprozessor verarbeitet.

local program = require("stolpro")

-- ── Enums ─────────────────────────────────────────────────────────────────────

local FootState = {
  NONE        = 0,
  TOE_OFF     = 1,
  HEEL_STRIKE = 2,
}

local TrialState = {
  DEFAULT          = 0,
  DETERMINE_STRIDE = 1,
  HABITUATION      = 2,
  PROTOCOL         = 3,
}

-- ── Hilfsfunktionen ───────────────────────────────────────────────────────────

local function shuffle(t)
  local result = {}
  for _, v in ipairs(t) do result[#result + 1] = v end
  for i = #result, 2, -1 do
    local j = math.random(i)
    result[i], result[j] = result[j], result[i]
  end
  return result
end

-- ── Programm-Metadaten ────────────────────────────────────────────────────────

program.name   = "Stolperprotokoll"
program.warmup = 10
program.seed   = 12345
program.enums  = { FootState, TrialState }

math.randomseed(program.seed)

program.inputs {
  "fz_left",
  "fz_right",
}

program.state {
  left             = FootState.NONE,
  right            = FootState.NONE,
  trial            = TrialState.DEFAULT,
  strides_tracker  = StrideTracker { capacity = 10 },
  avg_stride_left  = 0,
  avg_stride_right = 0,
}

program.base {
  lbs  = 0,
  rbs  = 0,
  sway = 0,
}

-- ── Events ────────────────────────────────────────────────────────────────────

---@event left_foot_heel_strike
function _()
  return fz_left < -400 and left ~= HEEL_STRIKE
end

---@listener left_foot_heel_strike
function _()
  left = HEEL_STRIKE
  if trial == DETERMINE_STRIDE then
    strides_tracker:start_left()
  end
end

-- ─────────────────────────────────────────────────────────────────────────────

---@event left_foot_toe_off
function _()
  return fz_left > -400 and left == HEEL_STRIKE
end

---@listener left_foot_toe_off
function _()
  left = TOE_OFF
  if trial == DETERMINE_STRIDE then
    strides_tracker:stop_left()
    log("Left:  " .. #strides_tracker.strides_left
        .. "/" .. strides_tracker.target_capacity)
  end
end

-- ─────────────────────────────────────────────────────────────────────────────

---@event right_foot_heel_strike
function _()
  return fz_right < -400 and right ~= HEEL_STRIKE
end

---@listener right_foot_heel_strike
function _()
  right = HEEL_STRIKE
  if trial == DETERMINE_STRIDE then
    strides_tracker:start_right()
  end
end

-- ─────────────────────────────────────────────────────────────────────────────

---@event right_foot_toe_off
function _()
  return fz_right > -400 and right == HEEL_STRIKE
end

---@listener right_foot_toe_off
function _()
  right = TOE_OFF
  if trial == DETERMINE_STRIDE then
    strides_tracker:stop_right()
    log("Right: " .. #strides_tracker.strides_right
        .. "/" .. strides_tracker.target_capacity)
  end
end

-- ─────────────────────────────────────────────────────────────────────────────

---@event stride_determination_completed
function _()
  return strides_tracker:has_completed()
end

---@listener stride_determination_completed
function _()
  local avg_l, avg_r = strides_tracker:avg_strides()
  avg_stride_left  = avg_l
  avg_stride_right = avg_r
  trial            = DEFAULT
  strides_tracker:reset()
  log(string.format("Left avg:  %.2fs", avg_l))
  log(string.format("Right avg: %.2fs", avg_r))
end

-- ── Buttons ───────────────────────────────────────────────────────────────────

---@button stride_determination_started "Determine Stride"
function _()
  trial = DETERMINE_STRIDE
end

---@button start_habituation "Start Habituation"
function _()
  trial = HABITUATION

  -- Trigger-Conditions als Lambdas: werden pro Frame geprüft,
  -- Stimulus feuert auf die steigende Flanke (nächster Heel Strike).
  local left_heel  = function() return left  == HEEL_STRIKE end
  local right_heel = function() return right == HEEL_STRIKE end

  local stimuli = shuffle {
    { seq = "trip_left",  trigger = left_heel  },
    { seq = "trip_right", trigger = right_heel },
    { seq = "trip_left",  trigger = left_heel  },
    { seq = "trip_right", trigger = right_heel },
    { seq = "trip_left",  trigger = left_heel  },
    { seq = "trip_right", trigger = right_heel },
  }

  for _, s in ipairs(stimuli) do
    enqueue(s.seq, s.trigger)
    pause(3000)
  end
end

-- ── Sequences ─────────────────────────────────────────────────────────────────

program.sequence("sway_cycle", {
  { sway = 0.05 },  { wait = 50 },
  { sway = -0.05 }, { wait = 50 },
})

program.sequence("trip_left", {
  { lerp = "lbs", to = 1.0, ms = 80 },
  { wait = 120 },
  { lerp = "lbs", to = 0,   ms = 200 },
})

program.sequence("trip_right", {
  { lerp = "rbs", to = 1.0, ms = 80 },
  { wait = 120 },
  { lerp = "rbs", to = 0,   ms = 200 },
})