#!/bin/sh
git checkout gh-pages
git rebase master
git push -u origin gh-pages
git checkout master