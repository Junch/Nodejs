# http://stackoverflow.com/questions/11156452/powershell-scripting-an-email-from-exchange

$from = "jun.chen@autodesk.com"
$to = "chenjun_76@163.com"
$smtp = "smtp.autodesk.com"
$title = "Hi"
$report = "Test mail"

$smtp_client = New-Object system.Net.Mail.SmtpClient
$smtp_client.Host = $smtp
    $credentials = New-Object system.Net.NetworkCredential
    $credentials.UserName = "ads/xxxxxx"
    $credentials.Password = "xxxxxx"
$smtp_client.Credentials = $credentials

$smtp_client.send($from, $to, $title,$report)
