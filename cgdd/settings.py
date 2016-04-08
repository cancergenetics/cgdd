"""
Django settings for cgdd project.

Generated by 'django-admin startproject' using Django 1.9.2.

For more information on this file, see
https://docs.djangoproject.com/en/1.9/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.9/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DEVELOPMENT = ('Django_projects' in BASE_DIR) # To indicate that is running on my local Windows computer, then set settings below accordingly:

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'hi0b%owp27jefp==#xz34=3d5x4f3-)0ezh0%o+4ba=8#&apju'
# SJB - Instead automatically build a secret key - from: https://gist.github.com/airtonix/6204802
# We can put setting.py into github, but don't put base/settings/key.py into github.
#try:
#    from .key import *
#except ImportError:
#    from base.lib.generate_key import generate_key
#    secret_key_file = open(os.path.join(HERE_DIR, "key.py"), "w")
#    secret_key_file.write("""SECRET_KEY = "{0}" """.format(generate_key(40, 128)))
#    secret_key_file.close()
#    from .key import *


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = DEVELOPMENT  # DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'gendep.apps.GendepConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders'   ## Added by SJB to enable Cross-Origin AJAX requests, for requesting string-db interactionsList 
                    ## see: http://techmightsolutions.blogspot.co.uk/2015/05/cors-in-django-rest-framework.html
                    ## and https://github.com/ottoyiu/django-cors-headers
                    ### BUT this doesn't help as still error about:
                    # XMLHttpRequest cannot load http://string-db.org/api/psi-mi-tab/interactionsList?network_flavor=confide…54991%0D9606.ENSP00000356355%0D9606.ENSP00000311684%0D9606.ENSP00000367830. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:8000' is therefore not allowed access.
]

MIDDLEWARE_CLASSES = [
    'corsheaders.middleware.CorsMiddleware',  # For CORS - needs to be at start of this list
    'django.middleware.common.CommonMiddleware',  # For CORS
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
if DEVELOPMENT:
    INSTALLED_APPS.append('django_extensions')  # Added for the runserver_plus: http://django-extensions.readthedocs.org/en/latest/runserver_plus.html
    INSTALLED_APPS.append('livereload') # For the livereload server
    MIDDLEWARE_CLASSES.append('livereload.middleware.LiveReloadScript')
    # *** This automatic setup of the debug toolbar is NOT compatible with GZipMiddleware (use the explicit setup for debug toolbar)
    # Slow and doesn't seem to monitor Ajax: INSTALLED_APPS.append('debug_toolbar') # For monitoring SQL etc. Needs: DEBUG = True, and staticfiles setup correctly.  See: http://django-debug-toolbar.readthedocs.org/en/1.4/installation.html#quick-setup
    # LIVERELOAD_PORT = 
    # RUNSERVERPLUS_POLLER_RELOADER_INTERVAL = 5 # For the runserver plus to reduce polling interval for changed files to 5 seconds.

ROOT_URLCONF = 'cgdd.urls'

CORS_ORIGIN_WHITELIST = (  # SJB added to enable CORS for stringdb
        'string-db.org',
    )


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
            'debug': DEBUG,
        },
    },
]

# The following debug line is depreciated since Django 1.8 so is replaced with the above option 'debug': DEBUG
# TEMPLATE_DEBUG = True


WSGI_APPLICATION = 'cgdd.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases


if DEVELOPMENT:
   # Using sqlite3 on my windows computer:
    DATABASES = {
      'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
      }
    }
else:
    # Using MySQL on production PythonAnywhere server: https://help.pythonanywhere.com/pages/UsingMySQL/
    # MySQL notes: https://docs.djangoproject.com/en/1.9/ref/databases/#mysql-notes
    # On pythonanywhere, using the 'mysqlclient' library.
    DATABASES = {
      'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'sbridgett$gendep',
        'TEST_NAME': 'sbridgett$test_gendep',
        'USER': 'sbridgett',
        'PASSWORD': 'drivers0',
        'HOST': 'sbridgett.mysql.pythonanywhere-services.com',
      }
    }

  # For webserver I should change ENGINE to: 'django.db.backends.postgresql' OR 'django.db.backends.mysql'
  # And set a database name.
  # And add:  USER, PASSWORD, and HOST
  # For PostgreSQL or MySQL, make sure youve created a database by this point. Do that with CREATE DATABASE database_name; within your databases interactive prompt.
  # See: https://docs.djangoproject.com/en/1.9/ref/settings/#std:setting-DATABASES

  # For HOST, An empty string means localhost.
  # eg:
  # DATABASES = {
  #    'default': {
  #        'ENGINE': 'django.db.backends.postgresql',
  #        'NAME': 'mydatabase',
  #        'USER': 'mydatabaseuser',
  #        'PASSWORD': 'mypassword',
  #        'HOST': '127.0.0.1',
  #        'PORT': '5432',
  #    }
  # }
  # Also can include test db name:
  #        'TEST': {
  #            'NAME': 'mytestdatabase',
  #        },

if DEVELOPMENT: # Use dummy cache, so can test speed of SQL query repeatidly
    #CACHES = {
    #    'default': {
    #        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    #    }
    #}
    # Or could use the local memory cacahe - which is per process. In Local Memory caching "each process will have its own private cache instance, which means no cross-process caching is possible. This obviously also means the local memory cache isn't particularly memory-efficient, so it's probably not a good choice for production environments. It's nice for development."
    # CACHES = {
    #    'default': {
    #    'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    #      # 'LOCATION': 'unique-snowflake', # Location not needed if just one cahche
    #     }
    # }
    # or File system - on Windows include drive letter, eg: 'c:/foo/bar',
    #CACHES = {
    #   'default': {
    #        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
    #        'LOCATION': 'c:/Users/HP/Django_projects/cgdd/cache_dir',
    #    }
    #}
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
            'LOCATION': 'gendep_cache_table',  # Need to create table using: python manage.py createcachetable
            'TIMEOUT': 36000, # 36000 = 10 hours. Defaults to 300 seconds (5 minutes). Set TIMEOUT to None so that cache keys never expire. 0 causes keys to immediately expire. See: https://docs.djangoproject.com/en/1.9/topics/cache/#cache-arguments
        }
    }

else:
    #CACHES = {
    #'default': {
    #       'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
    #       'LOCATION': '/var/tmp/django_cache',  # Needs absolute path
    #    }
    #}
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
            'LOCATION': 'gendep_cache_table',  # Need to create table using: python manage.py createcachetable
            'TIMEOUT': 36000, # 36000 = 10 hours. Defaults to 300 seconds (5 minutes). Set TIMEOUT to None so that cache keys never expire. 0 causes keys to immediately expire. See: https://docs.djangoproject.com/en/1.9/topics/cache/#cache-arguments
        }
    }
  
# Can also cache the templates: https://docs.djangoproject.com/en/1.9/ref/templates/api/#django.template.loaders.cached.Loader


# Password validation
# https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Dublin' # was UTC

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/

# For configuring static file paths, see: https://help.pythonanywhere.com/pages/DjangoStaticFiles/
STATIC_ROOT = os.path.join(BASE_DIR, "static") 

STATIC_URL = '/static/'
# STATIC_URL = '/static/' if DEVELOPMENT else 'http://sbridgett.pythonanywhere.com/static/'

"""
if DEVELOPMENT:
  # SJB added logging, based on: http://ianalexandr.com/blog/getting-started-with-django-logging-in-5-minutes.html
  LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format' : "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
            'datefmt' : "%d/%b/%Y %H:%M:%S"
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'mysite.log',
            'formatter': 'verbose'
        },
    },
    'loggers': {
        'django': {
            'handlers':['file'],
            'propagate': True,
            'level':'DEBUG',
        },
        'MYAPP': {
            'handlers': ['file'],
            'level': 'DEBUG',
        },
    }
  }
"""
