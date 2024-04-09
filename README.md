Make sure that the `publisher` is set properly in the `package.json`.
The `publisher` is not the organization in azure devops, it's the publisher set in the vscode marketplace.

The azure devops PAT (personal access token) expires (the longest period is 1 year). So we need to set the PTA token in the github secrets from time to time.

The github action manages the version, do not change it manually. It will bump-up the version and publish the extension. That's why every other commit is from github action itself.
