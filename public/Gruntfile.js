module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt, {config: './package.json'});
    require('time-grunt')(grunt);
    // 配置
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),

        clean: {
          main: {
            files: [
              {
                expand: true, 
                src: ['./static', './views', '.tmp', '../views/output']
              }
            ]
          }
        },
        copy: {
          main: {
            files: [
              {
                expand: true, 
                src: ['./eve', '!./eve/robert', '!./eve/_bak', './favicon.ico'], 
                dest: './static/'
              }
            ]
          },
          view: {
            files: [
              {
                expand: true, 
                cwd: './',
                src: ['../views/**/*.ejs'],
                dest: './views/'
              }
            ]
          }
        },
        htmlmin: {                                  
          dist: { 
            options: {            // Target options
              removeComments: true,
              collapseWhitespace: true
            },
            files: [{
              expand: true,
              src: ['./views/{,*/}*.ejs', './views/{,*/}*.html', '!./views/_test/**/*.*'],
              dest: './'
            }]
          }
        },
        autoprefixer: {
          options: {
            browsers: ['last 2 version']
          },
          dist: {
            files: [{
              expand: true,
              // cwd: '.tmp/styles/',
              src: [ 
                './static/**/*.css',
                '!./static/**/*.min.css' 
              ],
              dest: './static/'
            }]
          }
        },
        cssmin: {
          minify: {
            expand: true,
            src: [
              './eve/**/*.css',
              '!./**/*.min.css',
            ],
            dest: './static/'
          }
        },
        uglify : {
            build : {
                expand: true,
                src : [
                // './**/*.js',
                './eve/**/*.js',
                '!./eve/robert/*.js',
                '!./eve/**/*.min.js',
                '!./eve/lib/_bak/*.*',
                ],
                dest : './static/'
            },
            options: {
                /*beautify: {
                    beautify: true,
                    indent_start: 0,
                    indent_level: 0,
                    space_colon: false
                },*/
                "mangle": {
                    "except": ["require"]
                }
            }
        },
        //image min
        imagemin: {
          dist: {
              options: {
                  optimizationLevel: 3, //PNG优化水平
                  pngquant: true,
                  progressive: true
              },
              files: [{
                  expand: true,
                  // cwd: 'img/',
                  src: ['./eve/**/*.{png,jpg,jpeg,JPEG,PNG,JPG,gif,GIF}'], 
                  dest: './static/'
              }]
            }
        },
        rename: {
          move: {
              src: ['./dist', ],
              dest: './static/eve/robert'
          },
        },
        useminPrepare: {
          html: ['../views/**/*.ejs'],
          options: {
            root: './',
            dest: './views'
          }
        },
        usemin: { 
          html: ['./views/**/*.ejs'],      // 注意此处是build/
          options: {
            // assetsDirs: ['./static/'],
            blockReplacements: {
              css: function (block) {
                  return '<link rel="stylesheet" href="' + block.dest.replace(/^\.\./,'') + '?st='+(new Date).getTime()+'">';
              },
              js: function (block) {
                  return '<script type="text/javascript" src="' + block.dest.replace(/^\.\./,'') + '?st='+(new Date).getTime()+'"></script>';
              }
            }
          }
        },
        filerev: {
          options: {
            encoding: 'utf8',
            algorithm: 'md5',
            length: 8
          },
          assets: {
            files: [{
              src: [
                './static/**/*.{jpg,jpeg,gif,png,JPG,JPEG,PNG,GIF}',
                './static/**/*.{css,js}'
                // './eve/**/*.{eot,svg,ttf,woff}'
              ]
              // dest: './static'
            }]
          }
        },
    });
    // 注册任务
    grunt.registerTask('default', [
      'clean',
      'copy', 
      // 'htmlmin',//bug existed,if use this ,then use-min failed
      // 'autoprefixer',
      'cssmin', 
      'uglify', 
      'imagemin', 
      'rename',
      'useminPrepare',
      'concat:generated',
      'uglify:generated',
      'cssmin:generated',
      // 'filerev',
      'usemin'
    ]);
}; 
