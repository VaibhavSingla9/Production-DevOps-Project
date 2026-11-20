pipeline{
    agent any

    environment {
        PATH ="/opt/homebrew/bin:/usr/local/bin:${env.PATH}"
    }
    stages{
        stage("checkout"){
            steps{
                echo "checking out source code"
                checkout scm    
            }
        }

        stage("Install dependencies"){
            steps{
                echo "Installing dependencies"
                sh "npm ci"
            }
        }

        stage("Run tests"){
            steps{
                echo "Running tests"
                sh "npm test"
            }
        }

        stage("SonarQube Analysis") {
            steps {
                withCredentials([string(credentialsId: 'sonarqube-token1', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        sonar-scanner-npm \
                          -Dsonar.host.url=http://localhost:9000 \
                          -Dsonar.projectKey=production-devops-project
                    '''
                }
            }
        }


        stage("Build Docker Image"){
            steps{
                echo "Building Docker Image"
                sh "docker build -t production-devops-app:latest ."
            }
        }
    }
}