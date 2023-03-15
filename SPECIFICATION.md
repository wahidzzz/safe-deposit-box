# Technical specification
Simulation should be implemented using React (reactjs.org). Please use these libraries and APIs:
    ● redux
    ● Fetch API
    ● Sass/SCSS

You may use create-react-app to jumpstart the project. You should use redux-saga, redux-
thunk or similar redux middleware.

Control panel is composed of a body, number keypad and backlit screen. Product design doesn’t
need to be pixel perfect. General look & feel should be approximate to given design. You can find
design details in Appendix A at the end of this document.

## Backlit screen has two textual segments:
    ● top left segment that indicates if door is locked,
    ● main segment for status messages during locking/unlocking process.

Screen’s backlight is turned off when idle for more than 5 seconds. You can find all possible
values for the textual segments in Appendix B at the end of this document.

Locking/unlocking sequence is described in User’s manual for the safe. You can also check out
this video to see one variation of real world safe implementation: https://youtu.be/qNPJqtGSXuE

Number keypad doesn’t have submit/cancel keys for the commands and passcodes. Instead
input timeout should be implemented with the value of 1.2s: User enters sequence of button
presses, then if idle for 1.2s, control panel processes given input.

Mechanical process of locking/unlocking lasts 3 seconds.

Sometimes hotel guests leave the safe deposit box locked when they uncheck. Or sometimes
they just forget the passcode. This is why there is master unlock IoT feature:

    1. hotel’s staff member enters 6 zeros, which puts control panel into “service” mode,
    2. then staff member enters secret master code of unknown length that can be made up
    from any keypad character (eg. ‘4L5336*987**L01576823’).
    3. when input is completed, master code should be sent to this validation endpoint:
    https://9w4qucosgf.execute-api.eu-central-1.amazonaws.com/default/CR-JS_team_M02a?c
    ode=456R987L0123
    4. if response, eg. {sn:123456}, matches the serial number of the safe deposit box - door
    unlocks. Serial number is predefined and marked with [S/N] and placed on the door of the
    safe box. (check the design!)
    Additional notes:
    5. Master code is intentionally not given in this assignment, but you may try to find out
    which one it is.
    6. Response from the master code validation endpoint will be random for invalid master
    codes. So, be careful, there is no clear error response, just random values until the correct
    master code is given.
    

## Other requirements

Finished already? Here are some other very important requirements you can try out for
some extra points:
    ● Write all styles using BEM methodology.
    ● Implement computer keyboard input for safe box keypad.
    ● Have as much code as possible covered with unit tests.

## Appendix A - design details
Colors:
    ● background: #434343
    ● panel body: #7d7d7f
    ● button: #63636e
    ● button text: #f3f3f3
    ● screen text: #434343
    ● screen, backlight off: #47b2b2
    ● screen, backlight on: #7fffff
    Fonts:
    ● Roboto Mono Normal
    ● Roboto Mono Medium

## Appendix B - screen messages
Top left segment values:
    ● Locked
    ● Unlocked
### Main segment values:
    ● blank (no value)
    ● Error
    ● Ready
    ● Locking...
    ● Unlocking...
    ● Service
    ● Validating...