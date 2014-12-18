module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    app: {
      dev: 'src',
      dist: 'dist',
      test: 'spec',
      doc: 'docs',
      buildNo: '<%= pkg.version %>' + '-' + grunt.template.today("yyyymmddHHMM"),
      codeName: 'Evil',
      copyYear: '2014',
      releaseType: grunt.option('release-type') || 'patch',
      defaultCommitMsg: grunt.option('message') || 'Releasing a new version, forgot to customize my commit message. Shame on me.'
    },

    // Run a server to view docs
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: 'localhost',
          base: '<%= app.doc %>',
          keepalive: true,
          open: true
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
      dist: ['<%= app.dist %>'],
      test: ['build']
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

    // jasmine-node test runner
    jasmine_node: {
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec',
        jUnit: {
          report: true,
          savePath : "./build/reports/jasmine/",
          useDotNotation: true,
          consolidate: true
        }
      },
      all: ['spec/']
    },

    // Run shell commands
    shell: {
      link: {
        command: 'npm link'
      },
      preRelease: {
        command: 'git add . && git commit -m "<%= app.defaultCommitMsg %>"'
      },
      release: {
        command: 'grunt release:<%= app.releaseType %>'
      }
    },

    // Release a new version to GitHub and npm
    release: {
      options: {
        push: false,
        tagName: 'v<%= version %>',
        tagMessage: 'Release v<%= version %>',
        commitMessage: 'Release <%= version %>',
        github: {
          repo: 'billpatrianakos/conventional',
          usernameVar: 'GITHUB_USER',
          passwordVar: 'GITHUB_PASS'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-docco2'); // load-npm-tasks does not pick this up automatically

  grunt.registerTask('default', ['develop']);
  grunt.registerTask('develop', ['watch']);

  grunt.registerTask('build', [
    'jshint',
    'todos:scan',
    'clean:dist',
    'uglify:dist',
    'shell:link'
    ]);

  grunt.registerTask('dorelease', [
    'test',
    'build',
    'docco:docs',
    //'shell:preRelease',
    'shell:release'
    ]);

  grunt.registerTask('document', [
    'docco:docs',
    'connect:server'
    ]);

  grunt.registerTask('test', [
    'clean:test',
    'todos:scan',
    'jasmine_node'
    ]);
};
