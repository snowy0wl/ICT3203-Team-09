pipeline {

    agent any
    tools {
        nodejs 'node'
        jdk 'openjdk-11'
        maven 'Maven 3.6.3'
    }

    stages {
        stage('Build') {
            steps {
                dir('westoak-backend') {
                    sh 'mvn -B -DskipTests clean package'
                }
            }
        }
        stage('Code Quality Check via SonarQube') {
            steps {
                dir('westoak-backend') {
                    sh "mvn sonar:sonar \
                    -Dsonar.projectKey=OWASP \
                    -Dsonar.host.url=http://192.168.0.104:9000 \
                    -Dsonar.login=9429ffb2ff50516f2f754fab891e093648aa73a9"
                }
            }
        }
    } 
}