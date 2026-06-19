import time
import statistics
from typing import TypedDict

from stolpro.core.plugin_loader import plugin
from stolpro.core.plugin import PluginContext
from stolpro.core.data_model import DataChannelType, Buffers
from enum import Enum


REQUIRED_CHANNELS = [
    DataChannelType.FORCE_PLATE_LEFT_FZ,
    DataChannelType.FORCE_PLATE_RIGHT_FZ,
]


class FootState(Enum):
    NONE = 0
    TOE_OFF = 1
    HEEL_STRIKE = 2


class TrialState(Enum):
    DEFAULT = 0
    DETERMINE_STRIDE = 1
    HABITUATION = 2
    PROTOCOL = 3


class StrideTracker:

    def __init__(self, target_capacity=10):
        self.strides_left = []
        self.strides_right = []
        self.target_capacity = target_capacity

    def start_right(self):
        self.current_start_right = time.time()

    def stop_right(self):
        if not hasattr(self, "current_start_right") or len(self.strides_right) >= self.target_capacity:
            return
        self.strides_right.append(time.time() - self.current_start_right)

    def start_left(self):
        self.current_start_left = time.time()

    def stop_left(self):
        if not hasattr(self, "current_start_left") or len(self.strides_left) >= self.target_capacity:
            return
        self.strides_left.append(time.time() - self.current_start_left)
    
    def has_completed(self):
        left_completed = len(self.strides_left) == self.target_capacity
        right_completed = len(self.strides_right) == self.target_capacity
        return left_completed and right_completed
    
    def avg_strides(self):
        return statistics.fmean(self.strides_left), statistics.fmean(self.strides_right)
    
    def reset(self):
        self.strides_left = []
        self.strides_right = []


class State(TypedDict):
    left: FootState 
    right: FootState 
    trial: TrialState
    strides_tracker: StrideTracker 
    avg_stride_left: float
    avg_stride_right: float


INITIAL_STATE: State = {
    "left": FootState.NONE,
    "right": FootState.NONE,
    "trial": TrialState.DEFAULT,
    "strides_tracker": StrideTracker(),
    "avg_stride_left": float,
    "avg_stride_right": float,
}


@plugin("Stolperprotokoll", required_channels=REQUIRED_CHANNELS, initial_state=INITIAL_STATE)
def stolperprotokoll():
    """This is the re-implementation of the Stolperprotokoll as implemented in DFlow"""


@stolperprotokoll.event("left_foot_heel_strike")
def foot_detect(ctx: PluginContext[State]):
    if ctx.sample_nr < 10 or ctx.state["left"] == FootState.HEEL_STRIKE:
        return False
    buffer = ctx.get_buffer("fz_left")
    if buffer[-1] < -400:
        ctx.state["left"] = FootState.HEEL_STRIKE
        if ctx.state["trial"] == TrialState.DETERMINE_STRIDE:
            ctx.state["strides_tracker"].start_left()
        # return True
    return False


@stolperprotokoll.event("left_foot_toe_off")
def foot_detect(ctx: PluginContext[State]):
    if ctx.sample_nr < 10 or ctx.state["left"] != FootState.HEEL_STRIKE:
        return False
    buffer = ctx.get_buffer("fz_left")
    if buffer[-1] > -400:
        ctx.state["left"] = FootState.TOE_OFF
        if ctx.state["trial"] == TrialState.DETERMINE_STRIDE: 
            tracker = ctx.state["strides_tracker"]
            tracker.stop_left()
            ctx.log(f"Left: {len(tracker.strides_left)}/{tracker.target_capacity}")
        # return True
    return False


@stolperprotokoll.event("right_foot_heel_strike")
def foot_detect(ctx: PluginContext[State]):
    if ctx.sample_nr < 10 or ctx.state["right"] == FootState.HEEL_STRIKE:
        return False
    buffer = ctx.get_buffer("fz_right")
    if buffer[-1] < -400:
        ctx.state["right"] = FootState.HEEL_STRIKE
        if ctx.state["trial"] == TrialState.DETERMINE_STRIDE: 
            ctx.state["strides_tracker"].start_right()
        # return True
    return False


@stolperprotokoll.event("right_foot_toe_off")
def foot_detect(ctx: PluginContext[State]):
    if ctx.sample_nr < 10 or ctx.state["right"] != FootState.HEEL_STRIKE:
        return False
    buffer = ctx.get_buffer("fz_right")
    if buffer[-1] > -400:
        ctx.state["right"] = FootState.TOE_OFF
        if ctx.state["trial"] == TrialState.DETERMINE_STRIDE: 
            tracker = ctx.state["strides_tracker"]
            tracker.stop_right()
            ctx.log(f"Right: {len(tracker.strides_right)}/{tracker.target_capacity}")
        # return True
    return False
 

@stolperprotokoll.button("stride_determination_started", label="Determine Stride")
def stride_determination_started(ctx: PluginContext[State]):
    ctx.state["trial"] = TrialState.DETERMINE_STRIDE


@stolperprotokoll.event("stride_determination_completed")
def stride_determination_completed(ctx: PluginContext[State]):
    tracker = ctx.state["strides_tracker"]
    if not tracker.has_completed():
        return False
    avg_left, avg_right = tracker.avg_strides()
    ctx.state["avg_stride_left"] = avg_left
    ctx.state["avg_stride_right"] = avg_right
    ctx.state["trial"] = TrialState.DEFAULT
    tracker.reset()
    ctx.log(f"Left svg stride: {avg_left:.2f}s")
    ctx.log(f"Right svg stride: {avg_right:.2f}s")
    return True
