# proj-livestream
Daniel Killough and Amy Pavel

## [analysis/](./analysis)
Data analysis, description parsing, and quantitative analysis

## [prototype/](./prototype)
Prototype description app rendering text descriptions as they display at the same time as video. To be used with user screen readers. 

## [visualization/](./visualization)
Description data visualization. Live version hosted on https://dkillough.github.io/proj-livestream/visualization/ 

## [master-data.json](./master-data.json)
Master json file with all descriptions cleaned & formatted. Backups exist and it can be regenerated, but please don't modify.

<hr>

## Other folders

### [_audioDescData](./_audioDescData/)
Raw description text objects for each video exported from Descript & manually cleaned up. Used to generate files in [_exports/audio-text](./analysis/_exports/audio-text/) and [master-data.json](./master-data.json).

### [_textDescData](./_textDescData/)
Raw description json objects for each video exported from the Chrome extension backend. Used to generate files in [_exports/audio-text](./analysis/_exports/audio-text/) and [master-data.json](./master-data.json).

### [.badDataAndScripts](./.badDataAndScripts)
Hidden directory with old scripts and exports. No longer in use but archived for reference if needed.