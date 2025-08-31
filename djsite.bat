@echo off
echo ===== DJSite Manager =====

:menu
cls
echo.
echo Choose an option:
echo 1. Start Development Server - Runs the site with hot reload for active development
echo    (Changes you make to code will appear instantly in the browser)
echo.
echo 2. Build and Start Production Server - Creates optimized version and runs it
echo    (Use this when your site is ready for production/deployment)
echo.
echo 3. Clean and Rebuild - Removes cached files and reinstalls everything fresh
echo    (Use this when you're having strange errors or after major updates)
echo.
echo 4. Git Operations - Manage your code versions with Git
echo    (Check status, commit changes, or get latest updates)
echo.
echo 5. Exit - Close this manager
echo.
choice /c 12345 /n /m "Enter your choice (1-5): "

if errorlevel 5 goto end
if errorlevel 4 goto git_operations
if errorlevel 3 goto clean_rebuild
if errorlevel 2 goto production
if errorlevel 1 goto development

:development
cls
echo ===== DJSite Development Mode =====
echo Starting development server for active coding...

:: Create log file
set LOG_FILE=%~dp0djsite_dev_error.log
echo [%date% %time%] Starting DJSite Development Server > %LOG_FILE%

:: Install dependencies
echo Installing dependencies (libraries needed by the project)...
call npm install >> %LOG_FILE% 2>&1
if errorlevel 1 (
    echo ERROR: Failed to install dependencies.
    echo ERROR: Failed to install dependencies. >> %LOG_FILE%
    goto dev_error
)

:: Start dev server
echo Starting development server on port 3000...
echo Your site will be available at http://localhost:3000
echo Press Ctrl+C to stop the server when finished
start "" http://localhost:3000
call npm run dev

:: Return to menu when dev server is stopped
goto menu

:dev_error
echo.
echo ===== ERROR OCCURRED =====
echo Check djsite_dev_error.log for details
echo.
type %LOG_FILE%
echo.
pause
goto menu

:production
cls
echo ===== DJSite Production Mode =====
echo Building and starting production site (optimized version)...

:: Create log file
set LOG_FILE=%~dp0djsite_error.log
echo [%date% %time%] Starting DJSite Production > %LOG_FILE%

:: Check for Node.js
echo Checking for Node.js (required to run the site)...
where npm >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm not found. Please install Node.js.
    echo ERROR: npm not found. Please install Node.js. >> %LOG_FILE%
    goto prod_error
)

:: Install dependencies
echo Installing dependencies (libraries needed by the project)...
call npm install >> %LOG_FILE% 2>&1
if errorlevel 1 (
    echo ERROR: Failed to install dependencies.
    echo ERROR: Failed to install dependencies. >> %LOG_FILE%
    goto prod_error
)

:: Build the project
echo Building project (creating optimized version)...
call npm run build >> %LOG_FILE% 2>&1
if errorlevel 1 (
    echo ERROR: Build failed. Check djsite_error.log for details.
    goto prod_error
)

:: Start the server
echo Starting production server on port 3000...
echo Your site will be available at http://localhost:3000
echo Press Ctrl+C to stop the server when finished
start "" http://localhost:3000
call npm run start

:: Return to menu when production server is stopped
goto menu

:prod_error
echo.
echo ===== ERROR OCCURRED =====
echo Check djsite_error.log for details
echo.
type %LOG_FILE%
echo.
pause
goto menu

:clean_rebuild
cls
echo ===== Clean and Rebuild =====
echo This will remove cached files and reinstall everything fresh.
echo Useful when you're having strange errors or after major updates.

:: Create log file
set LOG_FILE=%~dp0djsite_rebuild.log
echo [%date% %time%] Clean and Rebuild DJSite > %LOG_FILE%

echo Cleaning .next directory (cached files)...
if exist .next rd /s /q .next
echo Cache cleared.

echo Cleaning node_modules (installed libraries)...
if exist node_modules rd /s /q node_modules
echo Node modules cleared.

echo Reinstalling dependencies (getting fresh copies of libraries)...
call npm install >> %LOG_FILE% 2>&1
if errorlevel 1 (
    echo ERROR: Failed to install dependencies.
    echo ERROR: Failed to install dependencies. >> %LOG_FILE%
    goto rebuild_error
)

echo Building project (creating optimized version)...
call npm run build >> %LOG_FILE% 2>&1
if errorlevel 1 (
    echo ERROR: Build failed. Check djsite_rebuild.log for details.
    goto rebuild_error
)

echo.
echo Rebuild completed successfully! Your site is ready to run.
pause
goto menu

:rebuild_error
echo.
echo ===== ERROR OCCURRED =====
echo Check djsite_rebuild.log for details
echo.
type %LOG_FILE%
echo.
pause
goto menu

:git_operations
cls
echo ===== Git Operations =====
echo Manage your code versions with Git

echo 1. Check Git Status - See what files have changed
echo 2. Commit and Push Changes - Save your changes to the repository
echo 3. Pull Latest Changes - Get the latest updates from others
echo 4. Return to Main Menu
echo.
choice /c 1234 /n /m "Enter your choice (1-4): "

if errorlevel 4 goto menu
if errorlevel 3 goto git_pull
if errorlevel 2 goto git_commit
if errorlevel 1 goto git_status

:git_status
cls
echo ===== Git Status =====
echo Showing what files have changed since last commit:
git status
echo.
pause
goto git_operations

:git_commit
cls
echo ===== Commit and Push Changes =====
echo This will save your changes to the repository.

echo Adding all changed files to Git...
git add .
    
set /p COMMIT_MSG="Enter a message describing your changes: "
echo Committing with message: %COMMIT_MSG%
git commit -m "%COMMIT_MSG%"
    
echo Pushing your changes to the remote repository...
git push
if errorlevel 1 (
    echo WARNING: Git push failed. You may need to pull changes first.
)
echo.
pause
goto git_operations

:git_pull
cls
echo ===== Pull Latest Changes =====
echo Getting the latest updates from the repository:
git pull
echo.
pause
goto git_operations

:end
echo Exiting DJSite Manager...
exit /b 0