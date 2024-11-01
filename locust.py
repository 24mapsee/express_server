from locust import HttpUser, task, constant
import random


class HelloWorldUser(HttpUser):
    wait_time = constant(1)
    # 테스트 대상 호스트 주소 지정
    host = ""

    @task
    def hello_world(self):
        self.client.get(
            "/map",
            headers={"Content-Type": "application/json"},
            name="/map"
        )
