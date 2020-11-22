pipeline {
    agent any
    tools {maven 'maven'}
    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Code Quality Check via SonarQube') {
            steps {
                script {
                    def scannerHome = tool 'SonarQube';
                    withSonarQubeEnv('SonarQube') {
                        sh "mvn sonar:sonar \
						-Dsonar.projectKey=team09\
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://192.168.2.75:9000/\
                        -Dsonar.login=8e78588a26b13ee6330b5db5533b9e76d3afbdb3"
                    }
                }
            }
        }
    }
        post {
            always {
                recordIssues enabledForFailure: true, tool: sonarQube()
            }
        }	
}