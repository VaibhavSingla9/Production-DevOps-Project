pipeline{
    agent any

    environment {
        PATH = "/opt/homebrew/bin:/usr/local/bin:${env.PATH}"
        AWS_REGION = 'ap-south-1'
        ECR_URI = '510497448465.dkr.ecr.ap-south-1.amazonaws.com/production-devops-app'
        DOCKER_CONFIG = '/Users/vaibhav/.docker-jenkins'
        DOCKER_HOST = 'unix:///Users/vaibhav/.docker/run/docker.sock'
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
                sh "docker build -t production-devops-app:${BUILD_NUMBER} ."
            }
        }

        stage("Trivy Security Scan") {
            steps {
                echo "Scanning Docker image for vulnerabilities"
                sh "trivy image production-devops-app:${BUILD_NUMBER}"
            }
        }

        stage("ECR Authentication") {
            steps {
                echo "Authenticating Docker with Amazon ECR"
                sh '''
                    aws ecr get-login-password --region $AWS_REGION | \
                    docker login --username AWS --password-stdin ${ECR_URI%%/*}
            '''
            }
        }

        stage("Push Image to ECR") {
            steps {
                echo "Tagging and pushing Docker image to ECR"
                sh '''
                    docker tag production-devops-app:${BUILD_NUMBER} ${ECR_URI}:${BUILD_NUMBER}
                    docker push ${ECR_URI}:${BUILD_NUMBER}
                '''
            }
        }

        stage("Deploy to Kubernetes") {
            steps {
                echo "Deploying new image to Kubernetes"
                sh '''
                    kubectl set image deployment/production-devops-deployment \
                    production-devops-app=${ECR_URI}:${BUILD_NUMBER} \
                    -n production
                '''
            }
        }


        stage("Verify Kubernetes Rollout") {
            steps {
                echo "Checking Kubernetes deployment status"
                sh '''
                    kubectl rollout status deployment/production-devops-deployment \
                    -n production --timeout=180s
                '''
            }
        }
    }
}