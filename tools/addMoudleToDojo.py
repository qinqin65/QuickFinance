import sys
import os
import re

IGNORE_REG = '(^require$|^module$|^exports$|^$)'
SPLIT_KEYWORD = "'dojo/errors/CancelError'"
LINESEP = '\n'
LOADED = []

def parseArgs():
    if len(sys.argv) < 4:
        raise Exception('wrong argument!')
    
    dojoSrcPath = sys.argv[1]
    desFilePath = sys.argv[2]
    dojoMoudle = sys.argv[3]
    
    if not os.path.exists(dojoSrcPath):
        raise Exception('the dojo src path does not exist!')
    elif not os.path.exists(desFilePath) or not os.path.isfile(desFilePath):
        raise Exception('the destination file path does not exist or it is not a file!')
    
    return (dojoSrcPath, desFilePath, dojoMoudle)

class fileHandler():
    def __init__(self, fileName, write=False):
        if write:
            self.file = open(fileName, 'r+')
        else:
            self.file = open(fileName)
        self.writable = write
        self.content = self.file.read()

    def write(self, content):
        if self.writable:
            self.file.write(content)

    def close(self):
        self.file.close()

class destFileHandler(fileHandler):
    def __init__(self, fileName):
        fileHandler.__init__(self, fileName, True)

    def isMoudleExist(self, moudleName):
        return self.content.find("'{0}':function()".format(moudleName)) != -1

    def addMoudle(self, moudleName, moudleContent):
        if self.content.find("'{0}':function()".format(moudleName)) == -1:
            splitPos = self.content.find(SPLIT_KEYWORD)
            partHead = self.content[:splitPos]
            partEnd = self.content[splitPos:]
            partAdd = "'{moudleName}':function(){{{linesep}{moudleContent}}},{linesep}".format(moudleName = moudleName, moudleContent = moudleContent, linesep = LINESEP)
            self.content = partHead + partAdd + partEnd
            print('moudles added:', moudleName)

    def writeToFile(self):
        self.file.seek(0, 0)
        self.write(self.content)

class moudleFileHandler(fileHandler):
    def __init__(self, dojoSrcPath, dojoMoudle):
        moudlePath = os.path.join(dojoSrcPath, dojoMoudle + '.js')
        if not os.path.exists(moudlePath):
            raise Exception('the moudle({0}) you want to import does not exist!'.format(dojoMoudle))
        elif os.path.isdir(moudlePath):
            path = os.path.join(moudlePath, 'main.js')
            if os.path.exists(path):
                moudlePath = path
            else:
                raise Exception('the moudle({0}) you want to import is a root moudle but the main.js does not exist!'.format(dojoMoudle))
        fileHandler.__init__(self, moudlePath)
        self.dojoMoudle = dojoMoudle
        self.loadedMoudles = []

    def getRightMoudleName(self, moudleName):
        moudles = moudleName.split('/')
        if moudles[-1] == '':
            rightMoudleName = 'main'
        elif moudles[-1] == '..':
            rightMoudleName = ''.join(self.dojoMoudle.split('/')[-2:-1])
        else:
            rightMoudleName = '/'.join(filter(lambda item:not item.startswith('.'), moudles))
        return rightMoudleName

    def getDependencyMoudles(self):
        moudles = []
        startString = 'define(['
        endString = '],'
        startPos = self.content.find(startString)
        endPos = self.content.find(endString)
        dependcyMoudles = self.content[startPos + len(startString):endPos]
        dependcyMoudles = re.sub('//.*', '', dependcyMoudles)
        dependcyMoudles = re.sub('/\*.*\*/', '', dependcyMoudles, 0, re.S)
        tmpMoudles = dependcyMoudles.split(',')
        for tmpMoudle in tmpMoudles:
            moudle = tmpMoudle.strip().strip('"').strip('\'\'')
            moudle = re.sub('!.*', '', moudle)
            if re.match(IGNORE_REG, moudle):
                continue
            if moudle == '..':
                moudle = ''.join(self.dojoMoudle.split('/')[0:1]) + '/' + self.getRightMoudleName('')
            elif moudle.startswith('./'):
                moudle = '/'.join(self.dojoMoudle.split('/')[:-1]) + '/' + self.getRightMoudleName(moudle)
            elif moudle.startswith('../'):
                moudle = '/'.join(self.dojoMoudle.split('/')[:(-moudle.count('../'))-1]) + '/' + self.getRightMoudleName(moudle)
            if moudle in LOADED:
                continue
            moudles.append(moudle)
            LOADED.append(moudle)
        return moudles


def addModle(moudleName, dojoSrcPath, desFileHandler):
    if desFileHandler.isMoudleExist(moudleName):
        print('moudle exist:', moudleName)
        return
    print('moudles want to add:', moudleName)
    moudleFIle = moudleFileHandler(dojoSrcPath, moudleName)
    moudleDependencies = moudleFIle.getDependencyMoudles()
    if moudleDependencies:
        for moudleDependency in moudleDependencies:
            addModle(moudleDependency, dojoSrcPath, desFileHandler)

    desFileHandler.addMoudle(moudleName, moudleFIle.content)
    moudleFIle.close()

if __name__ == '__main__':
    dojoSrcPath, desFilePath, dojoMoudle = parseArgs()
    destFile = destFileHandler(desFilePath)
    addModle(dojoMoudle, dojoSrcPath, destFile)
    destFile.writeToFile()
    destFile.close()
