// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Globalization;
using System.Windows;
using System.Windows.Data;
using System.Windows.Media;
using BossRush.Gui.Models;

namespace BossRush.Gui.Converters;

/// <summary>
/// Converts <see cref="StageState"/> to a <see cref="SolidColorBrush"/> for
/// the step indicator circle and text.
/// </summary>
public sealed class StageStateToBrushConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is not StageState state)
            return Brushes.Gray;

        string target = parameter as string ?? "circle";

        return (state, target) switch
        {
            (StageState.Pending,   "circle") => new SolidColorBrush(Color.FromRgb(0x2D, 0x31, 0x39)),
            (StageState.Pending,   "text")   => new SolidColorBrush(Color.FromRgb(0x6B, 0x72, 0x80)),
            (StageState.Active,    "circle") => new SolidColorBrush(Color.FromRgb(0xD4, 0xAF, 0x37)),
            (StageState.Active,    "text")   => new SolidColorBrush(Color.FromRgb(0xE8, 0xCC, 0x6A)),
            (StageState.Completed, "circle") => new SolidColorBrush(Color.FromRgb(0x4C, 0xAF, 0x50)),
            (StageState.Completed, "text")   => new SolidColorBrush(Color.FromRgb(0xA8, 0xA8, 0xA8)),
            (StageState.Failed,    "circle") => new SolidColorBrush(Color.FromRgb(0xF4, 0x43, 0x36)),
            (StageState.Failed,    "text")   => new SolidColorBrush(Color.FromRgb(0xF4, 0x43, 0x36)),
            _                                => Brushes.Gray,
        };
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        => throw new NotSupportedException();
}

/// <summary>
/// Converts <see cref="StageState"/> to a single-character glyph string.
/// </summary>
public sealed class StageStateToGlyphConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        return value is StageState state
            ? state switch
            {
                StageState.Pending   => "\u25CB",  // white circle
                StageState.Active    => "\u25CF",  // filled circle (gold via brush)
                StageState.Completed => "\u2713",  // checkmark
                StageState.Failed    => "\u2717",  // X mark
                _                    => "\u25CB",
            }
            : "\u25CB";
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        => throw new NotSupportedException();
}

/// <summary>
/// Converts a <see cref="TimeSpan"/> to a compact elapsed-time string
/// (e.g. "1.2s", "14.8s", "2m 03s").
/// </summary>
public sealed class TimeSpanToCompactStringConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is not TimeSpan ts || ts == TimeSpan.Zero)
            return "";

        if (ts.TotalMinutes >= 1)
            return $"{(int)ts.TotalMinutes}m {ts.Seconds:D2}s";

        return $"{ts.TotalSeconds:F1}s";
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        => throw new NotSupportedException();
}

/// <summary>
/// Returns <see cref="Visibility.Visible"/> when the bound boolean is true.
/// </summary>
public sealed class BoolToVisibilityConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        bool invert = parameter is string s && s == "invert";
        bool flag = value is bool b && b;
        if (invert) flag = !flag;
        return flag ? Visibility.Visible : Visibility.Collapsed;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        => throw new NotSupportedException();
}

/// <summary>
/// Returns <see cref="Visibility.Visible"/> when the bound string is not
/// null/empty.
/// </summary>
public sealed class StringNotEmptyToVisibilityConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        => string.IsNullOrEmpty(value as string) ? Visibility.Collapsed : Visibility.Visible;

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        => throw new NotSupportedException();
}
