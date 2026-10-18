// SPDX-License-Identifier: GPL-3.0-only
using System.Windows;
using System.Windows.Controls;

namespace BossRush.Gui;

public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
        Closing += (_, _) =>
        {
            if (DataContext is ViewModels.MainViewModel vm)
                vm.SaveSession();
        };
    }

    /// <summary>
    /// Auto-scroll the log panel to the bottom when new text arrives.
    /// Attached via TextChanged on the log TextBox in XAML.
    /// </summary>
    private void LogTextBox_TextChanged(object sender, TextChangedEventArgs e)
    {
        if (sender is TextBox tb)
        {
            tb.CaretIndex = tb.Text.Length;
            tb.ScrollToEnd();
        }
    }
}
