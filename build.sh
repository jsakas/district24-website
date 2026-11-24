#!/bin/bash
# Usage:
#   ./build.sh build         — build only
#   ./build.sh local         — build + deploy to local nginx at /usr/local/nginx/html/
#   ./build.sh docker        — build Docker image + run at http://localhost:8080
#   ./build.sh aws           — build + deploy to AWS Amplify

set -e

DEPLOY="${1:-}"
AMPLIFY_APP_ID="d2zcneygndvg6j"
AMPLIFY_BRANCH="production"
AWS_PROFILE="district24"
#LOCAL_PORT="8080"
LOCAL_PORT="80"
NGINX_HTML="${NGINX_HTML:-/usr/local/nginx/html}"

usage() {
  echo "Usage: $0 [local|docker|aws|aws-login]"
  echo ""
  echo "  build      Build the frontend and stop"
  echo "  local      Build frontend and deploy to local nginx (${NGINX_HTML})"
  echo "  docker     Build fresh Docker image and run via docker-compose"
  echo "  aws        Build, tag, push Docker image and redeploy to AWS Amplify"
  echo "  aws-login  if not already logged into AWS, will prompt in browser"
  echo ""
  echo "When deploying to AWS, first run:  aws login --profile $AWS_PROFILE"
  echo ""
  exit 1
}


# ── Build ────────────────────────────────────────────────────────────
function app_build() {
    rm -rf build
    rm -rf dist
    mkdir -p dist

    # Type-checks the project (astro check) and then renders every page in
    # src/pages/ to static HTML in build/. React is bundled only for the
    # interactive islands (navbar menus, meeting search, Google Sheet tables).
    npm run build
}
# ── Package ───────────────────────────────────────────────────────────────────
function app_package() {
    [[ ! -d "dist" ]] && { echo "Creating dist/"; mkdir dist; }
    [[ -f "dist/district24.zip" ]] && { echo "Removing old zip"; rm dist/*.zip; }
    (cd build && zip -r ../dist/district24.zip . -x "*.DS_Store")
}

# ── Deploy targets ────────────────────────────────────────────────────────────
function cmd_local() {
    cp -a build/. "$NGINX_HTML"/
    echo "Deployed to local nginx at $NGINX_HTML"
}

function cmd_docker() {
    docker build -t district24 .
    # Stop and remove any existing container with the same name
    docker rm -f district24 2>/dev/null || true
    docker run -d -p $LOCAL_PORT:80 --name district24 district24
    echo "Running at http://localhost:$LOCAL_PORT"
}

function cmd_aws() {
    AMPLIFY_APP_ID="${AMPLIFY_APP_ID:?Need AMPLIFY_APP_ID}"
    AMPLIFY_BRANCH="${AMPLIFY_BRANCH:-main}"

    echo "Creating Amplify deployment..."
    app_package
    DEPLOY_JSON=$(aws amplify create-deployment \
        --app-id "$AMPLIFY_APP_ID" \
        --branch-name "$AMPLIFY_BRANCH" \
        --profile $AWS_PROFILE \
        --output json)

    JOB_ID=$(echo "$DEPLOY_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin)['jobId'])")
    ZIP_UPLOAD_URL=$(echo "$DEPLOY_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin)['zipUploadUrl'])")

    echo "Uploading dist/district24.zip (job $JOB_ID)..."
    curl -s -w "\nHTTP %{http_code}\n" \
        -H "Content-Type: application/zip" \
        --upload-file dist/district24.zip \
        "$ZIP_UPLOAD_URL"

    echo "Starting deployment..."
    aws amplify start-deployment \
        --app-id "$AMPLIFY_APP_ID" \
        --branch-name "$AMPLIFY_BRANCH" \
        --job-id "$JOB_ID" \
        --profile $AWS_PROFILE \
        --output json

    echo "Deployment started (job $JOB_ID)!"
}

function cmd_aws_login() {
    # If not already logged in (to AWS), this will prompt you to do so in your default browser.
    aws login --profile $AWS_PROFILE
}

# ── Entry point ───────────────────────────────────────────────────────────────
# we always build, do not always package or deploy
app_build

[[ $# -ne 1 ]] && usage

case "$1" in
  build)      ;;
  local)      cmd_local  ;;
  docker)     cmd_docker ;;
  aws)        cmd_aws    ;;
  aws-login)  cmd_aws_login   ;;
  *)          usage      ;;
esac
