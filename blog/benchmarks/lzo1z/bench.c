#define _POSIX_C_SOURCE 200809L
#include <lzo/lzo1z.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

static unsigned char *read_file(const char *path, size_t *size) {
    FILE *f = fopen(path, "rb");
    if (!f) { perror(path); exit(1); }
    if (fseek(f, 0, SEEK_END)) exit(1);
    long n = ftell(f);
    if (n < 0 || fseek(f, 0, SEEK_SET)) exit(1);
    unsigned char *buf = malloc((size_t)n ? (size_t)n : 1);
    if (!buf || fread(buf, 1, (size_t)n, f) != (size_t)n) exit(1);
    fclose(f);
    *size = (size_t)n;
    return buf;
}

static double now_ns(void) {
    struct timespec ts;
    if (clock_gettime(CLOCK_MONOTONIC, &ts)) exit(1);
    return (double)ts.tv_sec * 1e9 + (double)ts.tv_nsec;
}

static void decode(const unsigned char *src, size_t src_len,
                   unsigned char *dst, size_t want_len) {
    lzo_uint out_len = (lzo_uint)want_len;
    int rc = lzo1z_decompress_safe(src, (lzo_uint)src_len, dst, &out_len, NULL);
    if (rc != LZO_E_OK || out_len != want_len) {
        fprintf(stderr, "decode failed: rc=%d len=%lu\n", rc, (unsigned long)out_len);
        exit(1);
    }
}

static double measure(const unsigned char *src, size_t src_len,
                      unsigned char *dst, size_t want_len, int ms) {
    double start = now_ns();
    double deadline = start + (double)ms * 1e6;
    unsigned long long calls = 0;
    do {
        for (int i = 0; i < 256; i++) decode(src, src_len, dst, want_len);
        calls += 256;
    } while (now_ns() < deadline);
    return (now_ns() - start) / (double)calls;
}

static int compare_double(const void *a, const void *b) {
    double x = *(const double *)a, y = *(const double *)b;
    return (x > y) - (x < y);
}

int main(int argc, char **argv) {
    if (argc != 5) { fprintf(stderr, "usage: bench compressed expected trial-ms trials\n"); return 1; }
    if (lzo_init() != LZO_E_OK) return 1;
    size_t src_len, want_len;
    unsigned char *src = read_file(argv[1], &src_len);
    unsigned char *want = read_file(argv[2], &want_len);
    unsigned char *dst = malloc(want_len ? want_len : 1);
    if (!dst) return 1;
    int trial_ms = atoi(argv[3]), trials = atoi(argv[4]);
    if (trial_ms < 1 || trials < 1 || trials > 100) return 1;
    decode(src, src_len, dst, want_len);
    if (memcmp(dst, want, want_len)) { fprintf(stderr, "output mismatch\n"); return 1; }
    measure(src, src_len, dst, want_len, 1500);
    double *samples = malloc((size_t)trials * sizeof(double));
    if (!samples) return 1;
    for (int i = 0; i < trials; i++)
        samples[i] = measure(src, src_len, dst, want_len, trial_ms);
    if (memcmp(dst, want, want_len)) { fprintf(stderr, "output mismatch after timing\n"); return 1; }
    qsort(samples, (size_t)trials, sizeof(double), compare_double);
    double ns = samples[trials / 2];
    printf("C liblzo2,%.2f,%.3f\n", ns, (double)want_len / ns);
    free(samples); free(dst); free(want); free(src);
    return 0;
}
