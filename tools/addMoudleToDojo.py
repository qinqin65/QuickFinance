import sys
import os

IGNORE_KEYWORD = 'dojo'
SPLIT_KEYWORD = "'dojo/errors/CancelError'"
LINESEP = '\n'

def parseArgs():
    if len(sys.argv) < 4:
        raise Exception('wrong argument!')
    
    dojoSrcPath = sys.argv[1]
    desFilePath = sys.argv[2]
    dojoMoudle = sys.argv[3]
    
    if not os.path.exists(dojoSrcPath):
        raise Exception('the dojo src path does not exist!')
    elif not os.path.exists(desFilePath) and not os.path.isfile(desFilePath):
        raise Exception('the destination file path does not exist or it is not a file!')
    
    return (dojoSrcPath, desFilePath, dojoMoudle)

class fileHandler():
    def __init__(self, fileName, write=False):
        if write:
            self.file = open(fileName)
        else:
            self.file = open(fileName, 'w')
        self.writable = write
        self.content = self.file.read()

    def write(self, content):
        if self.writable:
            self.file.write(content)

    def close(self):
        self.file.close()

class destFileHandler(fileHandler):
    def __init__(self, fileName):
        fileHandler.__init__(fileName, True)

    def addMoudle(self, moudleName, moudleContent):
        if self.content.find(moudleName) == -1:
            splitPos = self.content.find(SPLIT_KEYWORD)
            partHead = self.content[:splitPos]
            partEnd = self.content[splitPos:]
            partAdd = "'{moudleName}':function(){{{linesep}{moudleContent}}},{linesep}".format(moudleName = moudleName, moudleContent = moudleContent, linesep = LINESEP)
            self.write(partHead + partAdd + partEnd)

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

    def getDependencyMoudles(self):
        moudles = []
        startString = 'define(['
        endString = '],function'
        startPos = self.content.find(startString)
        endPos = self.content.find(endString)
        dependcyMoudles = self.content[startPos:endPos]
        tmpMoudles = dependcyMoudles.split(',')
        for tmpMoudle in tmpMoudles:
            moudle = tmpMoudle.strip(LINESEP).strip(' ').strip('"')
            if moudle.startswith(IGNORE_KEYWORD):
                continue
            elif moudle.startswith('./'):
                moudle = os.path.join(dojoMoudle.split('/')[:-1], moudle.split('/')[-1])
            elif moudle.startswith('../'):
                moudle = os.path.join(dojoMoudle.split('/')[:moudle.count('../')], moudle.split('/')[-1])
            moudles.append(moudle)
        return moudles


def addModle(moudleName, dojoSrcPath, desFileHandler):
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
    destFile.close()
