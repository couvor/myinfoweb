Add-Type -AssemblyName System.Drawing
$outDir = "C:\Users\couvor\Desktop\myinfoweb\public\team"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$people = @(
  @{ f = "zhou-gaofan";      ch = "周" },
  @{ f = "yi-deyu";          ch = "羿" },
  @{ f = "zhang-mingyang";   ch = "张" },
  @{ f = "liu-hao";          ch = "刘" },
  @{ f = "tan-yusen";        ch = "谈" },
  @{ f = "ouyang-zhaoqin";   ch = "欧阳" }
)

foreach ($p in $people) {
  $bmp = New-Object System.Drawing.Bitmap(240, 240)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = "AntiAlias"
  $g.TextRenderingHint = "AntiAliasGridFit"

  $rect = New-Object System.Drawing.Rectangle(0, 0, 240, 240)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $rect,
    [System.Drawing.Color]::FromArgb(255, 10, 86, 214),
    [System.Drawing.Color]::FromArgb(255, 110, 168, 255),
    35.0)
  $g.FillRectangle($brush, $rect)

  $fontSize = if ($p.ch.Length -gt 1) { 64 } else { 96 }
  $font = New-Object System.Drawing.Font("Microsoft YaHei", $fontSize, [System.Drawing.FontStyle]::Bold)
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = [System.Drawing.StringAlignment]::Center
  $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
  $g.DrawString($p.ch, $font, [System.Drawing.Brushes]::White, (New-Object System.Drawing.RectangleF(0, -6, 240, 240)), $sf)

  $path = Join-Path $outDir "$($p.f).png"
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $brush.Dispose()
  Write-Host "saved $path"
}
