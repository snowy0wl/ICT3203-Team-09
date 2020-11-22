pipeline {
    agent {docker { image 'maven' }}
    tools {maven 'maven'}
        stages {
            stage('Checkout SCM') {
                steps {
                    checkout scm
                }
            }
            stage ('Build') {
                steps {
                    sh '${M2_HOME}/bin/mvn --batch-mode -V -U -e clean verify -Dsurefire.useFile=false -Dmaven.test.failure.ignore'
                }
            }

            stage ('Analysis') {
                steps {
                    sh '${M2_HOME}/bin/mvn --batch-mode -V -U -e checkstyle:checkstyle pmd:pmd pmd:cpd findbugs:findbugs spotbugs:spotbugs'
                }
            }
        }
        post {
            always {
                junit testResults: '**/target/surefire-reports/TEST-*.xml'

                recordIssues enabledForFailure: true, tools: [mavenConsole(), java(), javaDoc()]
                recordIssues enabledForFailure: true, tool: checkStyle()
                recordIssues enabledForFailure: true, tool: spotBugs()
                recordIssues enabledForFailure: true, tool: cpd(pattern: '**/target/cpd.xml')
                recordIssues enabledForFailure: true, tool: pmdParser(pattern: '**/target/pmd.xml')
            }
        }	
}