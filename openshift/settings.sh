export PROJECT_NAMESPACE="583dbf"
export GIT_URI="https://github.com/bcgov/representation-grant-app.git"
export GIT_REF="main"

# The templates that should not have their GIT referances(uri and ref) over-ridden
# Templates NOT in this list will have they GIT referances over-ridden
# with the values of GIT_URI and GIT_REF
export skip_git_overrides="schema-spy-build.yaml backup-build.yaml"