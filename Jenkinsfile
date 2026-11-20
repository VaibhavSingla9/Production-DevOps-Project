pipeline{
    agent any

    environment {
        PATH = "/opt/homebrew/bin:${env.PATH}"
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

        stage("Build Docker Image"){
            steps{
                echo "Building Docker Image"
                sh "docker build -t production-devops-app:latest ."
            }
        }
    }
}