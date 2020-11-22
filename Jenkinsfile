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
        def mvnHome = tool 'mvn-default'

        sh "${mvnHome}/bin/mvn --batch-mode -V -U -e clean verify -Dsurefire.useFile=false"

        junit testResults: '**/target/*-reports/TEST-*.xml'

        def java = scanForIssues tool: java()
        def javadoc = scanForIssues tool: javaDoc()
        
        publishIssues issues: [java, javadoc], filters: [includePackage('io.jenkins.plugins.analysis.*')]
        }

        stage ('Analysis') {
            def mvnHome = tool 'mvn-default'

            sh "${mvnHome}/bin/mvn --batch-mode -V -U -e checkstyle:checkstyle pmd:pmd pmd:cpd findbugs:findbugs"

            def checkstyle = scanForIssues tool: checkStyle(pattern: '**/target/checkstyle-result.xml')
            publishIssues issues: [checkstyle]
    
            def pmd = scanForIssues tool: pmdParser(pattern: '**/target/pmd.xml')
            publishIssues issues: [pmd]
            
            def cpd = scanForIssues tool: cpd(pattern: '**/target/cpd.xml')
            publishIssues issues: [cpd]
            
            def spotbugs = scanForIssues tool: spotBugs(pattern: '**/target/findbugsXml.xml')
            publishIssues issues: [spotbugs]

            def maven = scanForIssues tool: mavenConsole()
            publishIssues issues: [maven]
            
            publishIssues id: 'analysis', name: 'All Issues', 
                issues: [checkstyle, pmd, spotbugs], 
                filters: [includePackage('io.jenkins.plugins.analysis.*')]
        }
    //     stage ('Analysis') {
    //         steps {
    //             sh 'mvn --batch-mode -V -U -e checkstyle:checkstyle pmd:pmd pmd:cpd findbugs:findbugs'
    //         }
    //     }

    //     // stage('Code Quality Check via SonarQube') {
    //     //     steps {
    //     //         script {
    //     //             def scannerHome = tool 'SonarQube';
    //     //             withSonarQubeEnv('SonarQube') {
    //     //                 sh "mvn sonar:sonar \
	// 	// 				-Dsonar.projectKey=team09\
    //     //                 -Dsonar.sources=. \
    //     //                 -Dsonar.host.url=http://192.168.2.75:9000/\
    //     //                 -Dsonar.login=8e78588a26b13ee6330b5db5533b9e76d3afbdb3"

    //     //             }
    //     //         }
    //     //     }
    //     // }
    // }
        post {
            always {
                // junit testResults: '**/target/surefire-reports/TEST-*.xml'
                recordIssues enabledForFailure: true, tools: [mavenConsole(), java(), javaDoc()]
                // recordIssues enabledForFailure: true, tool: checkStyle()recordIssues enabledForFailure: true, tool: spotBugs(pattern: '**/target/findbugsXml.xml')
                // recordIssues enabledForFailure: true, tool: cpd(pattern: '**/target/cpd.xml')
                // recordIssues enabledForFailure: true, tool: pmdParser(pattern: '**/target/pmd.xml')
                }
        }	
}