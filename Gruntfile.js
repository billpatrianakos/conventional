module.exports = function(grunt) {

  //require('load-grunt-tasks')(grunt);
  require('load-grunt-tasks')(grunt, {
    pattern: ['grunt-*', '!grunt-template-jasmine-requirejs']
  });
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    app: {
      dev: 'src',
      dist: 'dist',
      test: 'test',
      buildNo: '<%= pkg.version %>' + '-' + grunt.template.today("yyyymmddHHMM"),
      codeName: 'Evil',
      copyYear: '2014'
    },

    // Run a server to inspect tests
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '*',
        }
      }
    },

    // Watch while we develop
    watch: {
      scripts: {
        files: ['<%= app.dev %>/**/*.js', '<%= app.test %>/**/*.js', 'Gruntfile.js'],
        tasks: ['jshint:dev']
      }
    },

    // Uglify
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> (c) <%= app.copyYear %> Bill Patrianakos\n * Codename: <%= app.codeName %> (<%= app.buildNo %>)\n * <%= pkg.homepage %>\n */\n'
      },
      dist: {
        src: '<%= app.dev %>/conventional.js',
        dest: '<%= app.dist %>/conventional.js'
      }
    },

    // jshint
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        globals: {
          process: true,
          console: true,
          module: true,
          require: true
        },
        '-W097': true,
        '-W030': true
      },
      dev: ['<%= app.dev %>/**/*.js', '<%= app.test %>/**/*.js', 'Gruntfile.js']
    },

    // Clean dist before every build
    clean: {
      dist: ['<%= app.dist %>']
    },

    // Todos
    todos: {
      options: {
        verbose: false
      },
      scan: {
        src: ['*.md', '*.json', '<%= app.dev %>/**/*.js', '<%= app.test %>/**/*.js']
      }
    },

    // Generate docs
    docco: {
      options: {
        dst: 'docs',
        layout: 'parallel'
      },
      docs: {
        files: [
          {
            expand: true,
            cwd: '<%= app.dev %>/',
            src: ['**/*.js']
          }
        ]
      }
    },

    // Run the tests
    jasmine: {
      dist: {
        src: '<%= app.dist %>/**/*.js',
        options: {
          specs: '<%= app.test %>/*Spec.js',
          helpers: '<%= app.test %>/*Helper.js',
          template: require('grunt-template-jasmine-requirejs')
        }
      },
      dev: {
        src: '<%= app.dev %>/**/*.js',
        options: {
          specs: '<%= app.test %>/*Spec.js',
          helpers: '<%= app.test %>/*Helper.js',
          template: require('grunt-template-jasmine-requirejs')
        }
      }
    },

    // Run shell commands
    shell: {
      link: {
        command: 'npm link'
      }
    }
  });

  grunt.loadNpmTasks('grunt-docco2'); // load-npm-tasks does not pick this up automatically

  grunt.registerTask('default', ['develop']);

  grunt.registerTask('build', [
    'jshint',
    'todos:scan',
    'clean:dist',
    'uglify:dist',
    'shell:link'
    ]);

  grunt.registerTask('codeQuality', ['todos:scan']);

  grunt.registerTask('develop', [
    'watch'
    ]);

};
