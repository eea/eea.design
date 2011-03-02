import doctest
import unittest
from base import MigrationTestCase
from Testing.ZopeTestCase import FunctionalDocFileSuite

OPTIONFLAGS = (doctest.REPORT_ONLY_FIRST_FAILURE |
               doctest.ELLIPSIS |
               doctest.NORMALIZE_WHITESPACE)

def test_suite():
    return unittest.TestSuite((
            FunctionalDocFileSuite('tests/migration.txt',
                  optionflags=OPTIONFLAGS,
                  package='eea.design',
                  test_class=MigrationTestCase),
            FunctionalDocFileSuite('docs/tagcloud.txt',
                  optionflags=OPTIONFLAGS,
                  package='eea.design',
                  test_class=MigrationTestCase),
    ))

if __name__ == '__main__':
    unittest.main(defaultTest='test_suite')
