var recent_info_list=[
["https://stackoverflow.com/questions/111155/how-do-i-handle-the-window-close-event-in-tkinter","20080921 | python - How do I handle the window close event in Tkinter? - Stack Overflow",`
<syntaxhighlight lang="python">
import tkinter as tk
from tkinter import messagebox

root = tk.Tk()

def on_closing():
    if messagebox.askokcancel("Quit", "Do you want to quit?"):
        root.destroy()

root.protocol("WM_DELETE_WINDOW", on_closing)
root.mainloop()
</syntaxhighlight>
`],
];
