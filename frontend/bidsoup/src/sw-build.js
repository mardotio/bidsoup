const workboxBuild = require('workbox-build');

const buildSW = () => {
  return workboxBuild.injectManifest({
    swSrc: 'src/sw-template.js', // this is your sw template file
    swDest: 'build/sw.js', // this will be created in the build step
    globDirectory: 'build',
    globIgnores: [
      'api/**/*'
    ],
    globPatterns: [
      '**\/*.{js,css,html,png}',
    ]
  }).then(({count, size, warnings}) =>{
    warnings.forEach(console.warn);
    console.log(`${count} files will be pre-cached, totaling ${size} bytes.`);
  });
}

buildSW();
