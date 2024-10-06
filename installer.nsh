!define DIR_NAME "TaskList"

Function .onVerifyInstDir
  StrLen $0 "\${DIR_NAME}"
  StrCpy $1 "$INSTDIR" "" -$0
  StrCmp $1 "\${DIR_NAME}" +2 0
  StrCpy $INSTDIR "$INSTDIR\${DIR_NAME}"
FunctionEnd

Section "Install"
  Exec 'taskkill /F /IM "TaskList.exe"'
  WriteUninstaller "$INSTDIR\Uninstall TaskList.exe"
SectionEnd

Section "Uninstall"
  Exec 'taskkill /F /IM "TaskList.exe"'
  ; 删除所有内容
  RMDir /r "$INSTDIR"
SectionEnd