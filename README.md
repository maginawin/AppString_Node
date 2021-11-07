# App Strings Node

## 主要功能

- 提取 Android 与 iOS `strings` 文件的 `values`。
- 用翻译好的 `values` 翻译原 `strings`，用 `local_value === new_value` 来找 `Key`。

## 使用

### 提取 `values`。

```
node get_values.js -f strings.xml localizable.strings values.txt

// For example:
node get_values.js -f ./assert/strings.xml ./assert/localizable.strings ~/Downloads/app_strings.txt
```

### 翻译 `Android`。

```
node set_android.js andorid_strings.xml values_file_path output_file_path
```

### 翻译 `iOS`。

```
node set_ios.js ios.strings values_file_path output_file_path
```