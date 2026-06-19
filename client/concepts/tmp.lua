-- stolperprotokoll.lua  –  D-Flow Script-Modul
--
-- D-Flow-API (Platzhalter, ggf. anpassen):
--   GetValue("channel")   → aktuellen Kanalwert lesen
--   print(msg)            → D-Flow Log

-- ── Enums ─────────────────────────────────────────────────────────────────────

local FootState  = { NONE = 0, TOE_OFF = 1, HEEL_STRIKE = 2 }
local TrialState = { DEFAULT = 0, DETERMINE_STRIDE = 1, HABITUATION = 2, PROTOCOL = 3 }

-- ── StrideTracker ─────────────────────────────────────────────────────────────

local function StrideTracker(capacity)
  local self = {
    strides_left   = {},
    strides_right  = {},
    target_capacity = capacity or 10,
  }

  function self:start_left()  self._t_left  = os.clock() end
  function self:start_right() self._t_right = os.clock() end

  function self:stop_left()
    if not self._t_left then return end
    if #self.strides_left >= self.target_capacity then return end
    table.insert(self.strides_left, os.clock() - self._t_left)
    print(string.format("Left:  %d/%d", #self.strides_left, self.target_capacity))
  end

  function self:stop_right()
    if not self._t_right then return end
    if #self.strides_right >= self.target_capacity then return end
    table.insert(self.strides_right, os.clock() - self._t_right)
    print(string.format("Right: %d/%d", #self.strides_right, self.target_capacity))
  end

  function self:has_completed()
    return #self.strides_left  == self.target_capacity
       and #self.strides_right == self.target_capacity
  end

  function self:avg_strides()
    local function mean(t)
      local s = 0; for _, v in ipairs(t) do s = s + v end; return s / #t
    end
    return mean(self.strides_left), mean(self.strides_right)
  end

  function self:reset()
    self.strides_left  = {}
    self.strides_right = {}
    self._t_left       = nil
    self._t_right      = nil
  end

  return self
end

-- ── State (persistiert zwischen Frames) ───────────────────────────────────────

local state = {
  left             = FootState.NONE,
  right            = FootState.NONE,
  trial            = TrialState.DEFAULT,
  strides_tracker  = StrideTracker(10),
  avg_stride_left  = 0,
  avg_stride_right = 0,
}

local sample_nr = 0

-- ── Events ────────────────────────────────────────────────────────────────────

local function left_foot_heel_strike()
  if sample_nr < 10 then return end
  if state.left == FootState.HEEL_STRIKE then return end
  if GetValue("fz_left") < -400 then
    state.left = FootState.HEEL_STRIKE
    if state.trial == TrialState.DETERMINE_STRIDE then
      state.strides_tracker:start_left()
    end
  end
end

local function left_foot_toe_off()
  if sample_nr < 10 then return end
  if state.left ~= FootState.HEEL_STRIKE then return end
  if GetValue("fz_left") > -400 then
    state.left = FootState.TOE_OFF
    if state.trial == TrialState.DETERMINE_STRIDE then
      state.strides_tracker:stop_left()
    end
  end
end

local function right_foot_heel_strike()
  if sample_nr < 10 then return end
  if state.right == FootState.HEEL_STRIKE then return end
  if GetValue("fz_right") < -400 then
    state.right = FootState.HEEL_STRIKE
    if state.trial == TrialState.DETERMINE_STRIDE then
      state.strides_tracker:start_right()
    end
  end
end

local function right_foot_toe_off()
  if sample_nr < 10 then return end
  if state.right ~= FootState.HEEL_STRIKE then return end
  if GetValue("fz_right") > -400 then
    state.right = FootState.TOE_OFF
    if state.trial == TrialState.DETERMINE_STRIDE then
      state.strides_tracker:stop_right()
    end
  end
end

local function stride_determination_completed()
  if not state.strides_tracker:has_completed() then return end
  local avg_l, avg_r = state.strides_tracker:avg_strides()
  state.avg_stride_left  = avg_l
  state.avg_stride_right = avg_r
  state.trial = TrialState.DEFAULT
  state.strides_tracker:reset()
  print(string.format("Left avg stride:  %.2fs", avg_l))
  print(string.format("Right avg stride: %.2fs", avg_r))
end

-- ── Button ────────────────────────────────────────────────────────────────────

function on_stride_determination_started()
  state.trial = TrialState.DETERMINE_STRIDE
end

-- ── Tick – 300 Hz ─────────────────────────────────────────────────────────────

function tick()
  sample_nr = sample_nr + 1
  left_foot_heel_strike()
  left_foot_toe_off()
  right_foot_heel_strike()
  right_foot_toe_off()
  stride_determination_completed()
end