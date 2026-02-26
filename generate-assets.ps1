Add-Type -AssemblyName System.Drawing

$assetsPath = "d:\Slirn\WorkSpaces\PriProjs\Games\AngryBirds\assets"

function Create-BirdImage {
    param($name, $color, $outputPath)
    
    $bitmap = New-Object System.Drawing.Bitmap(64, 64)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = "AntiAlias"
    
    $brush = New-Object System.Drawing.SolidBrush($color)
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::Black, 2)
    
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.FillEllipse($brush, 8, 8, 48, 48)
    $graphics.DrawEllipse($pen, 8, 8, 48, 48)
    
    $eyeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $pupilBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    
    $graphics.FillEllipse($eyeBrush, 18, 20, 12, 14)
    $graphics.FillEllipse($eyeBrush, 34, 20, 12, 14)
    $graphics.FillEllipse($pupilBrush, 22, 24, 6, 8)
    $graphics.FillEllipse($pupilBrush, 38, 24, 6, 8)
    
    $beakBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Orange)
    $beakPoints = @(
        [System.Drawing.Point]::new(48, 30),
        [System.Drawing.Point]::new(60, 28),
        [System.Drawing.Point]::new(60, 36)
    )
    $graphics.FillPolygon($beakBrush, $beakPoints)
    
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $brush.Dispose()
    $pen.Dispose()
    $eyeBrush.Dispose()
    $pupilBrush.Dispose()
    $beakBrush.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
    
    Write-Host "Created: $outputPath"
}

function Create-PigImage {
    param($name, $radius, $outputPath)
    
    $size = $radius * 2 + 20
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = "AntiAlias"
    
    $greenBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::LightGreen)
    $darkGreenPen = New-Object System.Drawing.Pen([System.Drawing.Color]::ForestGreen, 2)
    
    $graphics.Clear([System.Drawing.Color]::Transparent)
    
    $center = $size / 2
    $graphics.FillEllipse($greenBrush, $center - $radius, $center - $radius, $radius * 2, $radius * 2)
    $graphics.DrawEllipse($darkGreenPen, $center - $radius, $center - $radius, $radius * 2, $radius * 2)
    
    $eyeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $pupilBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    
    $eyeOffset = $radius * 0.3
    $eyeSize = $radius * 0.35
    $graphics.FillEllipse($eyeBrush, $center - $eyeOffset - $eyeSize/2, $center - $eyeSize/2, $eyeSize, $eyeSize * 1.2)
    $graphics.FillEllipse($eyeBrush, $center + $eyeOffset - $eyeSize/2, $center - $eyeSize/2, $eyeSize, $eyeSize * 1.2)
    
    $pupilSize = $eyeSize * 0.5
    $graphics.FillEllipse($pupilBrush, $center - $eyeOffset - $pupilSize/2, $center - $pupilSize/4, $pupilSize, $pupilSize)
    $graphics.FillEllipse($pupilBrush, $center + $eyeOffset - $pupilSize/2, $center - $pupilSize/4, $pupilSize, $pupilSize)
    
    $nosePen = New-Object System.Drawing.Pen([System.Drawing.Color]::ForestGreen, 2)
    $noseRect = New-Object System.Drawing.Rectangle($center - $radius * 0.3, $center + $radius * 0.1, $radius * 0.6, $radius * 0.3)
    $graphics.DrawEllipse($nosePen, $noseRect)
    
    if ($name -eq "king") {
        $crownBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Gold)
        $crownPoints = @(
            [System.Drawing.Point]::new($center, $center - $radius - 15),
            [System.Drawing.Point]::new($center - 12, $center - $radius),
            [System.Drawing.Point]::new($center + 12, $center - $radius)
        )
        $graphics.FillPolygon($crownBrush, $crownPoints)
        $crownBrush.Dispose()
    }
    
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $greenBrush.Dispose()
    $darkGreenPen.Dispose()
    $eyeBrush.Dispose()
    $pupilBrush.Dispose()
    $nosePen.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
    
    Write-Host "Created: $outputPath"
}

function Create-BlockImage {
    param($name, $color, $width, $height, $outputPath)
    
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    $brush = New-Object System.Drawing.SolidBrush($color)
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::Black, 2)
    
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.FillRectangle($brush, 1, 1, $width - 2, $height - 2)
    $graphics.DrawRectangle($pen, 1, 1, $width - 2, $height - 2)
    
    $lightColor = [System.Drawing.Color]::FromArgb(100, [System.Drawing.Color]::White)
    $lightBrush = New-Object System.Drawing.SolidBrush($lightColor)
    $graphics.FillRectangle($lightBrush, 3, 3, $width - 10, 5)
    
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $brush.Dispose()
    $pen.Dispose()
    $lightBrush.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
    
    Write-Host "Created: $outputPath"
}

function Create-BackgroundImage {
    param($outputPath)
    
    $bitmap = New-Object System.Drawing.Bitmap(1280, 720)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    $skyBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        [System.Drawing.Point]::new(0, 0),
        [System.Drawing.Point]::new(0, 720),
        [System.Drawing.Color]::FromArgb(135, 206, 235),
        [System.Drawing.Color]::FromArgb(74, 144, 217)
    )
    $graphics.FillRectangle($skyBrush, 0, 0, 1280, 720)
    
    $cloudBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $graphics.FillEllipse($cloudBrush, 100, 80, 150, 80)
    $graphics.FillEllipse($cloudBrush, 150, 60, 120, 70)
    $graphics.FillEllipse($cloudBrush, 500, 120, 180, 90)
    $graphics.FillEllipse($cloudBrush, 560, 100, 140, 80)
    $graphics.FillEllipse($cloudBrush, 900, 60, 130, 70)
    $graphics.FillEllipse($cloudBrush, 950, 80, 100, 60)
    
    $groundBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::SaddleBrown)
    $graphics.FillRectangle($groundBrush, 0, 680, 1280, 40)
    
    $grassBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::ForestGreen)
    $graphics.FillRectangle($grassBrush, 0, 680, 1280, 10)
    
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $skyBrush.Dispose()
    $cloudBrush.Dispose()
    $groundBrush.Dispose()
    $grassBrush.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
    
    Write-Host "Created: $outputPath"
}

function Create-SlingshotImage {
    param($outputPath)
    
    $bitmap = New-Object System.Drawing.Bitmap(80, 120)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    $woodBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::SaddleBrown)
    $woodPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(101, 67, 33), 2)
    
    $graphics.Clear([System.Drawing.Color]::Transparent)
    
    $graphics.FillRectangle($woodBrush, 15, 10, 12, 100)
    $graphics.DrawRectangle($woodPen, 15, 10, 12, 100)
    
    $graphics.FillRectangle($woodBrush, 53, 10, 12, 100)
    $graphics.DrawRectangle($woodPen, 53, 10, 12, 100)
    
    $graphics.FillRectangle($woodBrush, 10, 100, 60, 15)
    $graphics.DrawRectangle($woodPen, 10, 100, 60, 15)
    
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $woodBrush.Dispose()
    $woodPen.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
    
    Write-Host "Created: $outputPath"
}

Write-Host "Generating game assets..."

$birdsPath = "$assetsPath\images\birds"
$pigsPath = "$assetsPath\images\pigs"
$blocksPath = "$assetsPath\images\blocks"
$bgPath = "$assetsPath\images\backgrounds"
$uiPath = "$assetsPath\images\ui"

Create-BirdImage -name "red" -color ([System.Drawing.Color]::Red) -outputPath "$birdsPath\bird_red.png"
Create-BirdImage -name "yellow" -color ([System.Drawing.Color]::Yellow) -outputPath "$birdsPath\bird_yellow.png"
Create-BirdImage -name "blue" -color ([System.Drawing.Color]::Blue) -outputPath "$birdsPath\bird_blue.png"
Create-BirdImage -name "black" -color ([System.Drawing.Color]::Black) -outputPath "$birdsPath\bird_black.png"
Create-BirdImage -name "white" -color ([System.Drawing.Color]::White) -outputPath "$birdsPath\bird_white.png"

Create-PigImage -name "small" -radius 20 -outputPath "$pigsPath\pig_small.png"
Create-PigImage -name "medium" -radius 28 -outputPath "$pigsPath\pig_medium.png"
Create-PigImage -name "large" -radius 36 -outputPath "$pigsPath\pig_large.png"
Create-PigImage -name "king" -radius 45 -outputPath "$pigsPath\pig_king.png"

Create-BlockImage -name "wood" -color ([System.Drawing.Color]::FromArgb(160, 82, 45)) -width 60 -height 120 -outputPath "$blocksPath\wood.png"
Create-BlockImage -name "glass" -color ([System.Drawing.Color]::FromArgb(135, 206, 250)) -width 60 -height 120 -outputPath "$blocksPath\glass.png"
Create-BlockImage -name "stone" -color ([System.Drawing.Color]::FromArgb(128, 128, 128)) -width 60 -height 120 -outputPath "$blocksPath\stone.png"

Create-BackgroundImage -outputPath "$bgPath\bg_sky.png"
Create-SlingshotImage -outputPath "$uiPath\slingshot.png"

Write-Host "All assets generated successfully!"
