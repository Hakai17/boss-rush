// SPDX-License-Identifier: GPL-3.0-only
using System;
using BossRush.Gui.Relay;

namespace BossRush.Gui.Models;

/// <summary>State of a single pipeline stage in the step indicator.</summary>
public enum StageState
{
    Pending,
    Active,
    Completed,
    Failed,
}

/// <summary>
/// Observable model for one of the 7 pipeline stages, used by the progress
/// step indicator in the UI.
/// </summary>
public sealed class PipelineStageProgress : ObservableObject
{
    public PipelineStageProgress(int index, string name, string description)
    {
        Index = index;
        Name = name;
        Description = description;
    }

    /// <summary>1-based stage index (1..7).</summary>
    public int Index { get; }

    /// <summary>Short display name (e.g. "Patch regulation").</summary>
    public string Name { get; }

    /// <summary>One-line explanation for tooltips.</summary>
    public string Description { get; }

    private StageState _state = StageState.Pending;
    public StageState State
    {
        get => _state;
        set => Set(ref _state, value);
    }

    private TimeSpan _elapsed;
    public TimeSpan Elapsed
    {
        get => _elapsed;
        set => Set(ref _elapsed, value);
    }

    private string _detail = "";
    public string Detail
    {
        get => _detail;
        set => Set(ref _detail, value);
    }

    /// <summary>Reset to initial pending state.</summary>
    public void Reset()
    {
        State = StageState.Pending;
        Elapsed = TimeSpan.Zero;
        Detail = "";
    }
}
