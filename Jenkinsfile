pipeline {

    agent any
    tools {
        nodejs 'NodeJS 8.x'
        jdk 'openjdk-11'
        maven 'Maven 3.6.3'
    }

    stages {
        // stage('Build') {
        //     steps {
        //         dir('westoak-backend') {
        //             sh 'mvn -B -DskipTests clean package'
        //         }
        //     }
        // }
        stage('Code Quality Check via SonarQube') {
            steps {
                dir('westoak-backend') {
                    sh "mvn sonar:sonar \
                    -Dsonar.projectKey=team09 \
                    -Dsonar.host.url=http://192.168.2.75:9000 \
                    -Dsonar.login=74cc0598a84a51ffad9faf25ae7b60c864635931"
                }

                dir('west-oak') {
                    script {
                        def scannerHome = tool 'SonarQube';
                        withSonarQubeEnv('SonarQube') {
                            sh "${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=team09front\
                            -Dsonar.sources=. \
                            -Dsonar.host.url=http://192.168.2.75:9000/\
                            -Dsonar.login=6e451f65be45c5849c91c749eb616cd44b72928b"
                        }
                    }
                }
            }
        }
    } 
}