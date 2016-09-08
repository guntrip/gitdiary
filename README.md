# gitdiary

Manages a neat little diary in your GitHub repository. Designed to be used as a bookmarklet and makes use of the GitHub API.

### Format

A new file is created for each month in the root of your repository in this format:

`2016-08.md`
`2016-09.md`
`2016-10.md`

Within each file, diary entries are added with the newest at the top, grouped into days. There's an [example file here](https://github.com/stevecat/gitdiary/blob/master/example.md).

### Usage

You will need to [create a personal access token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/) and a repository. The token will allow access to all of your repositories, not just the diary, so be careful; `login` and `user` are separate so a [different account](https://developer.github.com/guides/managing-deploy-keys/#machine-users) could be used.

Set the following variables:

```javascript
var token = "" // Your personal access token.
var login = "" // Authenticated GitHub account
var user  = "" // GitHub account hosting the repository
var repo  = "" // Name of the repository
```

To turn the script into a bookmarklet, first minimise it using a service such as [JSCompress](https://jscompress.com/); this will remove the comments and new lines. You can then append `javascript: ` and add it as a bookmark.

### Caveats

This uses the GitHub API's [Contents functions](https://developer.github.com/v3/repos/contents/) which has a limit of 1mb per file.

### Testing

For easier editing and debugging, you'll find `testing.html` with a big friendly button to run through the script. You'll need to follow the instructions within to create the `credentials.js` file if you want to keep your token out of gitdiary.js.
