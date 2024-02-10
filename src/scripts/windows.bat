@echo off
setlocal EnableDelayedExpansion

set "files="

for /f "delims=" %%a in ('dir /b /s "%USERPROFILE%\.Trash\*.webp" "%USERPROFILE%\.Trash\*.gif" "%USERPROFILE%\.Trash\*.png" "%USERPROFILE%\.Trash\*.jpg" "%USERPROFILE%\.Trash\*.jpeg" 2^>nul') do (
    set "filename=%%~nxa"
    set "filename_no_extension=!filename:~0,32!"

    if "!filename_no_extension!" equ "                                " (
        set "files=!files! "%%a" "
    )
)

if not "!files!" equ "" (
    echo SUCCESS:
    echo !files!
    del /q !files!
)
