""" Installer
"""
from os.path import join
import os
from setuptools import setup, find_packages

name = 'eea.design'
path = name.split('.') + ['version.txt']
version = open(join(*path)).read().strip()

setup(name=name,
      version=version,
      description="Plone4 theme for EEA",
      long_description=open("README.md").read() + "\n" +
                       open(os.path.join("docs", "HISTORY.txt")).read(),
      # https://pypi.python.org/pypi?%3Aaction=list_classifiers
      classifiers=[
          "Framework :: Zope2",
          "Framework :: Plone",
          "Framework :: Plone :: 4.0",
          "Framework :: Plone :: 4.1",
          "Framework :: Plone :: 4.2",
          "Framework :: Plone :: 4.3",
          "Programming Language :: Zope",
          "Programming Language :: Python",
          "Programming Language :: Python :: 2.7",
          "Topic :: Software Development :: Libraries :: Python Modules",
          "License :: OSI Approved :: GNU General Public License (GPL)",
      ],
      keywords='EEA Add-ons Plone Zope',
      author='European Environment Agency: IDM2 A-Team',
      author_email='eea-edw-a-team-alerts@googlegroups.com',
      url='https://github.com/eea/eea.design',
      license='GPL',
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['eea'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'Products.EEAContentTypes',
          'Products.EEAPloneAdmin',
          'Products.LinguaPlone',
          'Products.NavigationManager',
          'Products.eeawebapplication',

          'eea.cache',
          'eea.converter',
          'eea.facetednavigation > 10.0',
          'eea.icons',
          'eea.promotion',
          'eea.themecentre',
          'eea.translations',
          'eea.versions',

          'setuptools',
          'valentine.linguaflow',
          'qrcode',

          # Used in testing
          'plone.app.workflowmanager',

          # -*- Extra requirements: -*-
          'plone.app.async'
      ],
      entry_points="""
      # -*- Entry points: -*-

      [z3c.autoinclude.plugin]
      target = plone
      """,
      )
