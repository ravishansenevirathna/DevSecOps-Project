pipeline {
    agent any

    tools {
        jdk 'jdk17'
        nodejs 'node16'
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        DOCKER_IMAGE = 'ravidoc/netflix'
        IMAGE_TAG = "${BUILD_NUMBER}"
        CONTAINER_NAME = 'netflix-app'
        APP_PORT = '8081'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        disableConcurrentBuilds()
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout from Git') {
            steps {
                git branch: 'main', url: 'https://github.com/ravishansenevirathna/DevSecOps-Project.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh """
                        $SCANNER_HOME/bin/sonar-scanner \
                        -Dsonar.projectName=Netflix \
                        -Dsonar.projectKey=Netflix \
                        -Dsonar.sources=. \
                        -Dsonar.exclusions=node_modules/**,build/**,dist/**
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    timeout(time: 5, unit: 'MINUTES') {
                        def qg = waitForQualityGate()
                        if (qg.status != 'OK') {
                            error "Pipeline aborted due to quality gate failure: ${qg.status}"
                        }
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Security Scans') {
            parallel {
                stage('OWASP Dependency Check') {
                    steps {
                        dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit --format HTML --format XML', odcInstallation: 'DP-Check'
                        dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
                    }
                }

                stage('Trivy Filesystem Scan') {
                    steps {
                        sh 'trivy fs --severity HIGH,CRITICAL --format table --output trivyfs.txt .'
                    }
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {
                        // Use credentials for API key instead of hardcoding
                        withCredentials([string(credentialsId: 'tmdb-api-key', variable: 'TMDB_API_KEY')]) {
                            sh """
                                docker build --build-arg TMDB_V3_API_KEY=\${TMDB_API_KEY} \
                                -t ${DOCKER_IMAGE}:${IMAGE_TAG} \
                                -t ${DOCKER_IMAGE}:latest .
                            """
                            sh "docker push ${DOCKER_IMAGE}:${IMAGE_TAG}"
                            sh "docker push ${DOCKER_IMAGE}:latest"
                        }
                    }
                }
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh "trivy image --severity HIGH,CRITICAL --format table --output trivyimage.txt ${DOCKER_IMAGE}:${IMAGE_TAG}"
            }
        }

        stage('Cleanup Old Containers') {
            steps {
                script {
                    sh """
                        docker ps -a | grep ${CONTAINER_NAME} && docker stop ${CONTAINER_NAME} && docker rm ${CONTAINER_NAME} || true
                    """
                }
            }
        }

        stage('Deploy to Container') {
            steps {
                sh """
                    docker run -d \
                    --name ${CONTAINER_NAME} \
                    -p ${APP_PORT}:80 \
                    --restart unless-stopped \
                    ${DOCKER_IMAGE}:${IMAGE_TAG}
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    sh """
                        sleep 5
                        docker ps | grep ${CONTAINER_NAME}
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                expression { params.DEPLOY_TO_K8S == true }
            }
            steps {
                script {
                    dir('Kubernetes') {
                        withKubeConfig(credentialsId: 'k8s', namespace: 'default') {
                            sh """
                                kubectl apply -f deployment.yml
                                kubectl apply -f service.yml
                                kubectl rollout status deployment/netflix-app
                            """
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            // Archive security scan reports
            archiveArtifacts artifacts: 'trivyfs.txt,trivyimage.txt,**/dependency-check-report.*', allowEmptyArchive: true

            // Clean up Docker images to save space
            sh """
                docker image prune -f
                docker images | grep ${DOCKER_IMAGE} | grep -v ${IMAGE_TAG} | grep -v latest | awk '{print \$3}' | xargs -r docker rmi -f || true
            """
        }

        success {
            emailext (
                attachLog: true,
                subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """
                    <h2>Build Successful</h2>
                    <p><strong>Project:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p><strong>Docker Image:</strong> ${DOCKER_IMAGE}:${IMAGE_TAG}</p>
                    <p><strong>Status:</strong> ${currentBuild.result}</p>
                """,
                to: 'yourmail@gmail.com',
                mimeType: 'text/html',
                attachmentsPattern: 'trivyfs.txt,trivyimage.txt'
            )
        }

        failure {
            emailext (
                attachLog: true,
                subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """
                    <h2>Build Failed</h2>
                    <p><strong>Project:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p><strong>Status:</strong> ${currentBuild.result}</p>
                    <p>Please check the console output for details.</p>
                """,
                to: 'yourmail@gmail.com',
                mimeType: 'text/html',
                attachmentsPattern: 'trivyfs.txt,trivyimage.txt'
            )
        }

        unstable {
            emailext (
                attachLog: true,
                subject: "UNSTABLE: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """
                    <h2>Build Unstable</h2>
                    <p><strong>Project:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p><strong>Status:</strong> ${currentBuild.result}</p>
                """,
                to: 'yourmail@gmail.com',
                mimeType: 'text/html'
            )
        }
    }
}