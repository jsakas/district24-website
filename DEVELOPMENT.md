# Development

## Prerequisites
See [PREREQUISITES.md](PREREQUISITES.md) to get your local development environment set up.

## Project layout

```
src/
  pages/        One .astro file per page; the file name is the URL (cpc.astro -> /cpc/)
  layouts/      BaseLayout.astro: <head>, page title/description, navbar and footer
  components/   .astro components are static HTML; .tsx components are React
  data.ts       Site content: navigation, service positions, workshops, meetings
  types.ts      TypeScript types for the data in data.ts
  utils/        CSV parsing, date helpers, Google Sheet loading
  styles/       global.css
```

Most pages are plain `.astro` files and send no JavaScript to the browser. React components marked with
`client:load` (navbar, meeting search on `/groups/`, and the Google Sheet tables) are "islands" that run in the browser.

To add a page: create `src/pages/my-page.astro` using `BaseLayout` (give it a `title` and `description`), then add it to
`NAV_PAGES` or `NAV_GROUPS` in `src/data.ts`.

Old hash-style links such as `https://www.aadistrict24.org/#/calendar` are redirected to the matching page (`/calendar/`).

## Build
Now that you have your local development environment all set up, you'll want to build and run the website locally. 
This allows you to test your changes prior to commiting them to our git repository. 

To install the software dependencies that are required to **build** the project, you will first need to run:
```bash
npm install
```

### Quickest: Astro dev server
```bash
npm run dev
```
Then open http://localhost:4321/. The page reloads automatically when you save a file.

Other npm scripts:
```bash
npm run check     # TypeScript / Astro type check only
npm run build     # type check, then build the site into build/
npm run preview   # serve the contents of build/ at http://localhost:4321/
```
`npm run build` fails if there are type errors, so run `npm run check` before committing.

### NGINX  

To build and deploy to nginx running locally, you'll first want to do _one_ of the following.  

**Method 1**
- (recommended) Set the environment variable to the correct location for your html files
- Open a Terminal in WebStorm. If this isn't an Ubuntu (WSL) Terminal stop! Google how to set up WebStorm so that it integrates with WSL.
- Type in these commands:

```bash
pwd
cd
echo "export NGINX_HTML=/var/www/html" >> .bashrc
source .bashrc
```
Now you want to switch back to the directory that was printed out after you typed in 'pwd'. To do so, type in cd {directory name}

**Method 2**  
You will make a small change to the build script.  
Edit `build.sh` (using WebStorm) and change the path specified after NGINX_HTML from `"/usr/local/nginx/html"` to `"/var/www/html"`

After setting the env variable or changing the build script you will want to do this :

```bash
./build.sh local
```
Use your browser to view the site locally:

http://localhost/

Your nginx needs to serve `index.html` for directory URLs (the default) so that `/calendar/` serves `/calendar/index.html`.

### RANCHER or DOCKER  
First open Rancher Desktop or Docker Desktop, whichever you installed.  
Now, to build and deploy to Rancher or Docker, run this:
```bash
./build.sh docker
```

Use your browser to view the site locally:

http://localhost/ (the port is `LOCAL_PORT` in `build.sh`)

In every case, the build type-checks the project and has Astro write the finished site to `build/`: one
`index.html` per page plus the CSS and JavaScript in `build/_astro/`.

## Deploy targets

```
./build.sh build    # builds the site, then stops
./build.sh local    # build + deploy to local nginx (either /usr/local/nginx/html or /var/www/html)
./build.sh docker   # build Docker image + run at http://localhost/
./build.sh aws      # build + deploy to AWS Amplify (uploads the contents of build/)
```

AWS deploy requires `aws login --profile district24` first.
