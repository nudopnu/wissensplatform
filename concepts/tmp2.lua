-- stolperprotokoll.lua
-- Valides Lua – @-Annotationen werden vom stolpro-Präprozessor verarbeitet.
-- StrideTracker, log(), emit() kommen aus dem Framework (require "stolpro").

local program = require("stolpro")

-- ── Enums ─────────────────────────────────────────────────────────────────────
-- Normale Lua-Tabellen; das Framework macht ihre Werte im Event-Environment
-- als Globals verfügbar (HEEL_STRIKE, DETERMINE_STRIDE, …)

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

-- ── Programm-Metadaten ────────────────────────────────────────────────────────

program.name   = "Stolperprotokoll"
program.warmup = 10          -- erste 10 Samples ignorieren
program.enums  = { FootState, TrialState }

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
-- @when  → Condition-String, via load() in den Proxy-Environment kompiliert.
-- Body   → Action-String, ebenso. State-Felder und Enum-Werte sind direkt
--          verfügbar (kein "state." Präfix), Schreibzugriffe landen im State.

---@event left_foot_heel_strike
---@when fz_left < -400 and left ~= HEEL_STRIKE
function _()
  left = HEEL_STRIKE
  if trial == DETERMINE_STRIDE then
    strides_tracker:start_left()
  end
end

---@event left_foot_toe_off
---@when fz_left > -400 and left == HEEL_STRIKE
function _()
  left = TOE_OFF
  if trial == DETERMINE_STRIDE then
    strides_tracker:stop_left()
    log("Left:  " .. #strides_tracker.strides_left
        .. "/" .. strides_tracker.target_capacity)
  end
end

---@event right_foot_heel_strike
---@when fz_right < -400 and right ~= HEEL_STRIKE
function _()
  right = HEEL_STRIKE
  if trial == DETERMINE_STRIDE then
    strides_tracker:start_right()
  end
end

---@event right_foot_toe_off
---@when fz_right > -400 and right == HEEL_STRIKE
function _()
  right = TOE_OFF
  if trial == DETERMINE_STRIDE then
    strides_tracker:stop_right()
    log("Right: " .. #strides_tracker.strides_right
        .. "/" .. strides_tracker.target_capacity)
  end
end

---@event stride_determination_completed
---@when strides_tracker:has_completed()
function _()
  local avg_l, avg_r = strides_tracker:avg_strides()
  avg_stride_left  = avg_l
  avg_stride_right = avg_r
  trial            = DEFAULT
  strides_tracker:reset()
  log(string.format("Left avg:  %.2fs", avg_l))
  log(string.format("Right avg: %.2fs", avg_r))
  emit("stride_determination_completed")
end

-- ── Buttons ───────────────────────────────────────────────────────────────────

---@button stride_determination_started "Determine Stride"
function _()
  trial = DETERMINE_STRIDE
end

-- ── Sequences ─────────────────────────────────────────────────────────────────
-- Reine Datentabellen – kein eval, direkt vom Framework abgetastet.

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