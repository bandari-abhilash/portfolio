# LZO1Z cross-language decompression benchmark

These harnesses compare the portfolio author's [Go LZO1Z decoder](https://github.com/bandari-abhilash/LZO-GO), `liblzo2` in C, and `lzo-java` in Java. They decode the same `.lzo1z` files from the Go repository's `testdata/` directory into preallocated buffers. Each harness checks its complete output against the matching `.orig` file before timing, and checks the output again afterward. The C and Java harnesses use their safe LZO1Z decoders.

## Results

Measured on an Apple M1 MacBook Air (8 GB RAM), sequentially, with one benchmark process running at a time. Go 1.27.0; `liblzo2` 2.10; Java 20.0.2 with `lzo-core` 1.0.6. Each process warmed up for 1.5 seconds, then ran five 300 ms trials. The table reports the median. Throughput is uncompressed bytes divided by elapsed time, in decimal GB/s. The processes were single-threaded but not pinned to a specific core.

| Original data | Size | Go ns/call | Go GB/s | Java ns/call | Java GB/s | C ns/call | C GB/s |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `text` | 7,991 B | 3,959.74 | 2.018 | 1,578.60 | 5.062 | 715.67 | 11.166 |
| `records` | 23,200 B | 15,514.17 | 1.495 | 10,806.29 | 2.147 | 3,944.16 | 5.882 |
| `large` | 60,000 B | 29,956.12 | 2.003 | 13,082.82 | 4.586 | 3,797.80 | 15.799 |

The three inputs have different compression patterns, so throughput changes substantially by input. These numbers describe this machine, decoder versions, and harnesses; they are not a general ranking of Go, Java, and C. The Go repository's README contains separate Go-only benchmark results from a different run.

## Reproduce

Build the harnesses from their source files in this directory. Run `go build` from the `LZO-GO` module directory so the import resolves to the local checkout. Link the C harness with `liblzo2`; compile the Java harness against `lzo-core-1.0.6.jar`.

```sh
cd /path/to/LZO-GO
go build -o /tmp/bench-go /path/to/portfolio/blog/benchmarks/lzo1z/bench.go
cc -O2 -o /tmp/bench-c /path/to/portfolio/blog/benchmarks/lzo1z/bench.c -llzo2
javac -cp /path/to/lzo-core-1.0.6.jar -d /tmp /path/to/portfolio/blog/benchmarks/lzo1z/BenchJava.java

/tmp/bench-go testdata/records.lzo1z testdata/records.orig 300 5
/tmp/bench-c testdata/records.lzo1z testdata/records.orig 300 5
java -cp /tmp:/path/to/lzo-core-1.0.6.jar BenchJava testdata/records.lzo1z testdata/records.orig 300 5
```

Run the same three commands with `text` and `large` in place of `records` for the other rows. The output format is `decoder,ns/call,GB/s`. On Homebrew systems, the C command may need `-I/opt/homebrew/include -L/opt/homebrew/lib` before `-llzo2`.
