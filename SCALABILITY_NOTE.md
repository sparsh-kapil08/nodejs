# Scalability Note

This app is small right now, but it can grow later.

- **Microservices**: split auth, tasks, and frontend into separate services when the app gets bigger.
- **Caching**: store common reads in memory or Redis so the database is not hit every time.
- **Load balancing**: run more than one server and place a load balancer in front so traffic is shared.

For now, the app is fine as a simple single-server project. These ideas matter when more users and more data are added.
