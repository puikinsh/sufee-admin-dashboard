module.exports = function(grunt) {

    const sass = require('node-sass');
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            dist: {
                files: {
                    'assets/css/style.css': 'assets/scss/style.scss'
                }
            }
        },

    pleeease: {
    custom: {
      options: {
        autoprefixer: {'browsers': ['last 4 versions', 'ios 6']},
        filters: {'oldIE': true},
        rem: ['12px'],
        minifier: false,
        import: {'path': "assets/css/"}
      },
      files: {
        'assets/css/style.css': 'assets/css/style.css'
      }
    }
    },

    lintspaces: {
            options: {
                editorconfig: '.editorconfig'
            },
            sass: {
                src: [
                    'assets/scss/*.scss'
                ]
            },
            html: {
                src: [
                    '*.html'
                ]
            }
        },


  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-pleeease');
  grunt.loadNpmTasks('grunt-lintspaces');

  // Default task(s).
  grunt.registerTask('default', ['lintspaces','sass','pleeease']);

};
