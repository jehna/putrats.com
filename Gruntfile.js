var markdown = require( "markdown" ).markdown;

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            default: {
                files: {
                  "static/css/style.css": "src/less/bootstrap.less"
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.less'],
                tasks: ['less', 'uncss', 'cssmin'],
                options: {
                  spawn: false,
                },
            },
            templates: {
                files: ['templates/*.html', 'comics/*.json', 'src/blog/*.json', 'src/markdown/*.md'],
                tasks: ['build'],
                options: {
                  spawn: false,
                },
            },
        },
        htmlmin: {
            default: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyJS: true
                },
                files: [{
                    expand: true,     // Enable dynamic expansion.
                    cwd: 'static/',      // Src matches are relative to this path.
                    src: ['*.html', '**/*.html'], // Actual pattern(s) to match.
                    dest: 'static/',   // Destination path prefix.
                    //ext: '.min.js',   // Dest filepaths will have this extension.
                    //extDot: 'first'   // Extensions in filenames begin after the first dot
                }],
            }
        },
        imagemin: {
            default: {
                files: [{
                    expand: true,
                    cwd: 'src/images/',
                    src: '*',
                    dest: 'static/images/'
                }]
            }
        },
        uncss: {
            default: {
                options: {
                    htmlroot: 'static/'
                },
                files: {
                    'static/css/style.css': ['static/*.html', 'static/**/*.html']
                }
            }
        },
        cssmin: {
            default: {
                files: {
                    'static/css/style.css': ['static/css/style.css']
                }
            }
        },
        sitemap: {
            dist: {
                siteRoot: 'static/'
            }
        },
        robotstxt: {
            dist: {
                dest: 'static/',
                policy: [{
                        sitemap: ['<%= pkg.homepage %>sitemap.xml']
                    },
                    {
                        crawldelay: 100
                    },
                    {
                        host: '<%= pkg.homepage %>'
                    }
                ]
            }
        },
        template: {}
    });
  
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-template');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-sitemap');
    grunt.loadNpmTasks('grunt-robots-txt');
    
    grunt.registerTask('build', 'build all files', function() {
        var pkg = grunt.file.readJSON('package.json');
        
        function compileFolder(expandFolder) {
            
            grunt.file.expand(expandFolder)
            .map(function(file) {
                conf = grunt.file.readJSON(file);
                conf.isBlogPost = (file.indexOf("blog") > -1);
                return conf;
            })
            .sort(function(a,b) {
                return a.id > b.id ? 1 : -1;
            })
            .forEach(function(conf,i,a) {
                conf.isFirst = (i == 0);
                conf.isLast = (i == a.length-1);
                conf.siteurl = pkg.homepage;
                conf.lastid = a[a.length-1].id;
                conf.blogPost = false;
                conf.folder = (conf.isBlogPost == true) ? "blog" : "comics";
                
                if (conf.isBlogPost) {
                    var mdFileName = "src/markdown/" + conf.id + ".md";
                    if(grunt.file.exists(mdFileName)) {
                        conf.blogPost = markdown.toHTML(
                            grunt.file.read(mdFileName)
                        )
                    }
                }
                
                
                var filename = "static/" + conf.folder + "/" + conf.id + "/index.html";
                var files = {}
                files[filename] = ['templates/template.html'];
                
                grunt.config('template.'+conf.folder + conf.id+'.options.data', conf);
                grunt.config('template.'+conf.folder + conf.id+'.files', files);
                
                
                if (conf.isLast) {
                    var lastFolderFile = {}
                    lastFolderFile["static/" + conf.folder + "/index.html"] = ['templates/template.html'];
                    
                    grunt.config('template.last'+conf.folder+'.options.data', conf);
                    grunt.config('template.last'+conf.folder+'.files', lastFolderFile);
                    
                    if (conf.isBlogPost) {
                        var lastFile = {"static/index.html": ['templates/template.html']}
                        grunt.config('template.last.options.data', conf);
                        grunt.config('template.last.files', lastFile);
                    }
                }
            });
            
        }
        
        compileFolder("comics/*.json");
        compileFolder("src/blog/*.json");
        
        grunt.task.run(['template']);
        grunt.task.run(['htmlmin']);
        grunt.task.run(['sitemap']);
        grunt.task.run(['robotstxt']);
    });
    
    // Default task(s).
    grunt.registerTask('default', ['less', 'uncss', 'cssmin', 'build', 'imagemin', 'watch']);

};