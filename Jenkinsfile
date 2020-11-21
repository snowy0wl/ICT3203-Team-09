pipeline {
	agent any
	
	tools {
		nodejs "node"
		jdk "openjdk-11"
		maven "Maven 3.6.3"
	}
	
	stages {
		stage('Build') {
			steps {
				dir('west-oak') {
					sh 'npm install'
					sh 'npm run build'
				}
				dir('westoak-backend') {
					sh 'mvn -B -DskipTests clean package'
				}
			}
		}
		stage('Test') {
			steps {
				dir('west-oak') {
					sh 'CI=true npm test'
				}
				dir('westoak-backend') {
					sh 'mvn test'
				}
			}
		}
		stage('OWASP DependencyCheck') {
			steps {
				dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'Default'
			}
		}
	}	
	post {
		success {
			dependencyCheckPublisher pattern: 'dependency-check-report.xml'
		}
		always {
			//junit 'target/surefire-reports/*.xml'
			junit allowEmptyResults: true, testResults: '**/test-results/*.xml'
		}
	}
}

