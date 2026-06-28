$files = @("c:\gravity\index.html", "c:\gravity\shop.html")
foreach ($f in $files) {
    $c = Get-Content $f -Raw
    $c = $c -replace '(?s)    window\.triggerGoogleSignIn = function\(forceRedirect = false\) \{.*?    \};\r?\n    window\.globalCatalog = \[\];', "    window.triggerGoogleSignIn = function(forceRedirect = false) {`n        localStorage.setItem('cenin_return_url', window.location.href);`n        window.location.href = 'login.html';`n    };`n    window.globalCatalog = [];"
    Set-Content -Path $f -Value $c -NoNewline
}

$f = "c:\gravity\wishlist.html"
$c = Get-Content $f -Raw
$c = $c -replace '(?s)    window\.triggerGoogleSignIn = function\(forceRedirect = false\) \{.*?    \};\r?\n    function showSuspensionOverlay', "    window.triggerGoogleSignIn = function(forceRedirect = false) {`n        localStorage.setItem('cenin_return_url', window.location.href);`n        window.location.href = 'login.html';`n    };`n    function showSuspensionOverlay"
Set-Content -Path $f -Value $c -NoNewline

$f = "c:\gravity\profile.html"
$c = Get-Content $f -Raw
$c = $c -replace '(?s)    window\.triggerGoogleSignIn = function\(\) \{.*?    \};\r?\n    window\.db = db;', "    window.triggerGoogleSignIn = function() {`n        localStorage.setItem('cenin_return_url', window.location.href);`n        window.location.href = 'login.html';`n    };`n    window.db = db;"
Set-Content -Path $f -Value $c -NoNewline

Write-Host "Done replacing!"
