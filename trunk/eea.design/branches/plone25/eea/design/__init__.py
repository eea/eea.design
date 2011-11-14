from Products.CMFCore.DirectoryView import registerDirectory
from Products.CMFCore import utils
from Globals import package_home
from os.path import dirname

GLOBALS = globals()

ppath = utils.ProductsPath
utils.ProductsPath.append(dirname(package_home(GLOBALS)))
registerDirectory('skins', GLOBALS)
utils.ProductsPath = ppath
