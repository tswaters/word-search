# Word sets

These word sets were borrowed from the kdeedu-data repository:

```
https://github.com/KDE/kdeedu-data
```

```
svn checkout svn://anonsvn.kde.org/home/kde/branches/stable/l10n-kf5/en_GB/data/kdeedu/kdeedu-data
cd kdeedu-data
for f in *.kvtml; do
    cat $f | \
      grep "text" | \
      grep -v ">.*[ ].*</" | \
      sed 's/.*<text>\(.*\)<\/text>/"\1"/g' | \
      sort | jq -s '.' \
    > ./`basename $f kvtml`json
done
```

I also manually removed a few that didn't fit.
Also added a bunch of terms, and merged a few sets together.

## LICENSE

kdeedu-data is licensed under GNU GPL 2.0
