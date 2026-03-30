Dim wordApp
Dim doc
Dim shell
Dim cwd
Dim inputPath
Dim outputPath

Set shell = CreateObject("WScript.Shell")
cwd = shell.CurrentDirectory
inputPath = cwd & "\市场调~1.DOC"
inputPath = cwd & "\input.doc"
outputPath = cwd & "\doc_export.html"

Set wordApp = CreateObject("Word.Application")
wordApp.Visible = False
wordApp.DisplayAlerts = 0

Set doc = wordApp.Documents.Open(inputPath)
' 10 = wdFormatFilteredHTML
doc.SaveAs2 outputPath, 10
doc.Close False
wordApp.Quit
