# Zwift Workout Editor (fork)

[Website](https://nene.github.io/zwo-editor/)

This is a fork of the [zwo-editor][] for [zwiftworkout.com][] originally written by Carlo Schiesaro.

Compared to the original, there's one major difference in editing experience:

- Instructions (text events) are stored within interval blocks
  (so that moving an interval also moves its instructions).

Some functionality has been dropped (at least for now):

- No server-side features (which aren't fully open-sourced in the original).
- No text-based editor (which has lots of bugs in the original).
- No conversion between running and cycling workouts (which is buggy in the original).

On the other hand, bunch of bugs have been fixed:

- Fixed various issues with data consistency.
- Fixed visual bugs in resizing of ramp intervals.
- Fixed several bugs in reading & writing of ZWO files.
- Fixed occasional Infinity distance [#38][]
- Removed TSS from running workouts [#39][]
- Display exact running pace in tooltip [#41][]
- Support for free run intervals [#43][]

These fixes might seem like minor things, but to pull them off,
the inner workings of the app have been substantially changed:

- Substantial changes for the internal representation of the intervals.
- Adopted Redux for managing the state.
- Replaced plain CSS with styled-components.
- Refactored away most of the code in 1300-line tightly coupled Editor component.
- Added lots of tests.
- Stricter use of types.
- Enforced consistent code-style rules.

## TODO

Plans going forward:

- Integrate with [zwiftout][] text-based editor.
- Fix more [bugs from the original][orig-bugs].
- Pick a different name and logo to distinguish from the original.
- Toggling between showing %FTP / wattage / W/kg.
- Editing of all values (duration, intensity, cadence) within the tooltip.

[zwo-editor]: https://github.com/breiko83/zwo-editor
[zwiftworkout.com]: https://www.zwiftworkout.com/
[orig-bugs]: https://github.com/breiko83/zwo-editor/issues/
[#38]: https://github.com/breiko83/zwo-editor/issues/38
[#39]: https://github.com/breiko83/zwo-editor/issues/39
[#41]: https://github.com/breiko83/zwo-editor/issues/41
[#43]: https://github.com/breiko83/zwo-editor/issues/43
[zwiftout]: https://github.com/nene/zwiftout
