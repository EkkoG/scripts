name_type=$1

p_file=$(find . -type f -name "*.pbxproj" | grep -v Pods | head -1)
current_version=$(grep -Eo 'CURRENT_PROJECT_VERSION = [0-9]+' $p_file | grep -Eo '[0-9]+' | tail -1)
echo "当前版本号: $current_version"
new_version=$(($current_version + 1))
echo "新版本号: $new_version"
sed -i '' "s/CURRENT_PROJECT_VERSION = .*;/CURRENT_PROJECT_VERSION = $new_version;/g" $p_file

if [ "$name_type" == "" ]; then
    exit 0
fi
current_version_name=$(grep -Eo 'MARKETING_VERSION = [0-9.]+' $p_file | grep -Eo '[0-9.]+' | tail -1)
echo "当前版本名: $current_version_name"
if [ "$name_type" == "major" ]; then
    new_version_name=$(echo $current_version_name | awk -F. '{print $1+1".0.0"}')
elif [ "$name_type" == "minor" ]; then
    new_version_name=$(echo $current_version_name | awk -F. '{print $1"."$2+1".0"}')
elif [ "$name_type" == "patch" ]; then
    new_version_name=$(echo $current_version_name | awk -F. '{print $1"."$2"."$3+1}')
fi
echo "新版本名: $new_version_name"
sed -i '' "s/MARKETING_VERSION = .*;/MARKETING_VERSION = $new_version_name;/g" $p_file
